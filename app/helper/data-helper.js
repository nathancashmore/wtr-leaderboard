const config = require('getconfig');
const logger = require('winston');
const jsonFile = require('jsonfile-promised');
const teamList = require('../data/team-list.json');

module.exports = class DataHelper {

    constructor() {
        logger.info(`Data directory set to : ${config.DATA_DIR}`);
    }

    getStanding() {
        // for each team in button- history add up their points
        const buttonHistoryFile = `${config.DATA_DIR}/button-history.json`;
        let teamScores = [];

        return jsonFile.readFile(buttonHistoryFile).then(history => {
            teamList.forEach(team => {

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

            });

            teamScores.sort((a, b) => b.score - a.score)

            return teamScores;
        }).catch(e => logger.log('error', e));
    }
};
