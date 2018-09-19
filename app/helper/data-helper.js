const logger = require('winston');
const jsonFile = require('jsonfile-promised');
const moment = require('moment');

const asyncRedis = require("async-redis");

let client, dataDir, noOfTeams;

module.exports = class DataHelper {

    constructor(dataDir, noOfTeams, redisUrl) {
        logger.info(`Data directory set to : ${dataDir}`);
        logger.info(`Total number of teams set to : ${noOfTeams}`);
        logger.info(`Redis URL set  to: ${redisUrl}`);

        this.dataDir = dataDir;
        this.noOfTeams = noOfTeams;
        this.client = asyncRedis.createClient(6379, redisUrl, {no_ready_check: true});
    }

    async setStartDate(startDate) {
        await this.client.set("startDate", startDate);
    }

    async getDay() {
        let startDate = await this.client.get("startDate");
        return moment().diff(moment(startDate), 'days');
    }

    getStanding() {
        // for each team in button- history add up their points
        const buttonHistoryFile = `${this.dataDir}/button-history.json`;
        let teamScores = [];

        return jsonFile.readFile(buttonHistoryFile).then(history => {
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
        }).catch(e => logger.log('error', e));
    }
};
