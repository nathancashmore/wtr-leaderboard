const logger = require('winston');
const moment = require('moment');
const asyncRedis = require("async-redis");

module.exports = class DataHelper {

    constructor(noOfTeams, redisUrl) {
        logger.info(`Total number of teams set to : ${noOfTeams}`);
        logger.info(`Redis URL set  to: ${redisUrl}`);

        this.noOfTeams = noOfTeams;
        this.client = asyncRedis.createClient(redisUrl, {no_ready_check: true});
    }

    async setStartDate(startDate) {
        await this.client.set("startDate", startDate);
    }

    async getDay() {
        let startDate = await this.client.get("startDate");
        return moment().diff(moment(startDate), 'days');
    }

    async getStanding() {
        let teamScores = [];

        let history = JSON.parse(await this.client.get("buttonHistory"));

        let team = 1;

        while( team < this.noOfTeams + 1 ) {

            let teamHistory = history
                .filter(history => history["team"] === team);

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
};
