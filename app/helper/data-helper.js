const logger = require('winston');
const moment = require('moment');
const asyncRedis = require('async-redis');

module.exports = class DataHelper {

    constructor(noOfTeams, redisUrl) {
        logger.info(`Total number of teams set to : ${noOfTeams}`);
        logger.info(`Redis URL set  to: ${redisUrl}`);

        this.noOfTeams = noOfTeams;
        this.client = asyncRedis.createClient(redisUrl, {no_ready_check: true});
    }

    async setStartDate(startDate) {
        await this.client.set('startDate', startDate)
            .catch((e) => { logger.error(`Call to setStartDate failed due to : ${e}`) });
    }

    async getDay() {
        let startDate = await this.client.get('startDate')
            .catch((e) => { logger.error(`Call to getDay failed due to : ${e}`) });

        return moment().diff(moment(startDate, 'YYYY-MM-DD'), 'days');
    }

    async getScore(day) {
        // Find all the entries for the current day and -1 ... e.g. first button press = no of teams - no of button presses
		let cachedHistory = await this.client.get('buttonHistory')
			.catch(logger.info('No button press history found. Must be the first button press ?'));

		if ( cachedHistory === null ) { return this.noOfTeams }

		let history = JSON.parse(cachedHistory);

		let dayHistory = history.filter(history => history['day'] === day);

		return this.noOfTeams - dayHistory.length
	}

    getTeam(buttonNumber, day) {
        // Found out which team the button belongs to for the day.
        // e.g. button number + day = team; if team > 10 .. team = team - no of teams
        // e.g
        // btn=1 day=0 -> team=1
        // btn=10 day=0 -> team=10
        // btn=1 day=10 -> team=11 - 10 = 1
        // btn=10 day=10 -> team=20 - 10 = 10

        const offset = Number(buttonNumber) + Number(day);
        return ( Number(offset) > Number(this.noOfTeams) ) ? Number(offset) - Number(this.noOfTeams) : offset;
    }

    async getStanding() {
        let team = 1;
        let teamScores = [];

        let cachedHistory = await this.client.get('buttonHistory')
            .catch(logger.info('No button press history found... returning empty list'));

        if ( cachedHistory === null ) { return [] }

        let history = JSON.parse(cachedHistory);

        while( team < this.noOfTeams + 1 ) {

            let teamHistory = history
                .filter(history => history['team'] === team);

            if(teamHistory.length !== 0) {
                const score = teamHistory
                    .map(x => x.score)
                    .reduce((prev, curr) => prev + curr);

                teamScores.push({ name: team, score })
            } else {
                teamScores.push({ name: team, score: 0 })
            }

            team++;
        }

        teamScores.sort((a, b) => b.score - a.score);

        return teamScores;
    }

    async pressButton(buttonNumber, team, day, score) {
        let history = [];

        let cachedHistory = await this.client.get('buttonHistory')
            .catch(logger.info('No button press history found, will start a new history log'));

        if ( cachedHistory !== null ) {
            history = JSON.parse(cachedHistory);
        }

        history.push({"team": team, "button": buttonNumber, "day": day, "time": moment().format('HH:mm:ss'), "score": score});

        return await this.client.set('buttonHistory', JSON.stringify(history))
			.catch((e) => { logger.error(`Call to pressButton failed when setting buttonHistory due to : ${e}`) });
    }
};
