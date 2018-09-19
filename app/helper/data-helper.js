const config = require('getconfig');
const logger = require('winston');
const jsonFile = require('jsonfile-promised');
const moment = require('moment');

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient(process.env.REDISCLOUD_URL|'127.0.0.1', {no_ready_check: true});

module.exports = class DataHelper {

    constructor() {
        logger.info(`Data directory set to : ${config.DATA_DIR}`);
        logger.info(`Total number of teams set to : ${config.NO_OF_TEAMS}`)
    }

    async setStartDate(startDate) {
        await client.set("startDate", startDate);
    }

    async getDay() {
        let startDate = await client.get("startDate");
        return moment().diff(moment(startDate), 'days');
    }

    getStanding() {
        // for each team in button- history add up their points
        const buttonHistoryFile = `${config.DATA_DIR}/button-history.json`;
        let teamScores = [];

        return jsonFile.readFile(buttonHistoryFile).then(history => {
            let team = 1;

            while( team < config.NO_OF_TEAMS + 1 ) {

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

            teamScores.sort((a, b) => b.score - a.score)

            return teamScores;
        }).catch(e => logger.log('error', e));
    }
};
