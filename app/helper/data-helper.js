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
        if (startDate === undefined ) {
            return new Error('Unable to set start date as input was undefined');
        }

        await this.client.set('startDate', startDate)
            .catch((e) => { logger.error(`Call to setStartDate failed due to : ${e}`) });
    }

    async getDay() {
        let startDate = await this.client.get('startDate')
            .catch((e) => { logger.error(`Call to getDay failed due to : ${e}`) });

        return moment().diff(moment(startDate, 'YYYY-MM-DD'), 'days');
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

        return await this.client.set('buttonHistory', JSON.stringify(history));
    }
};
