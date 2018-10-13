const logger = require('heroku-logger');
const moment = require('moment');
const asyncRedis = require('async-redis');

module.exports = class DataHelper {

  constructor(noOfTeams, redisUrl) {
    logger.info(`Total number of teams set to : ${noOfTeams}`);
    logger.info(`Redis URL set  to: ${redisUrl}`);

    this.noOfTeams = noOfTeams;
    this.client = asyncRedis.createClient(redisUrl, {no_ready_check: true});
  }

    getNoOfTeams() {
        return this.noOfTeams;
    }async setStartDate(startDate) {
        await this.client.set('startDate', startDate)
            .catch((e) => { logger.error(`Call to setStartDate failed due to : ${e}`)
    });
  }

  async getDay() {
    let startDate = await this.client.get('startDate')
      .catch((e) => {
        logger.error(`Call to getDay failed due to : ${e}`)
      });

    let day = moment().diff(moment(startDate, 'YYYY-MM-DD'), 'days');

    return ( !(day > -1) || day >= this.noOfTeams ) ? -1 : day;
  }

  async clearHistory() {
    let noOfKeysRemoved = await this.client.del('buttonHistory')
      .catch((e) => {
        logger.error(`Call to delete buttonHistory failed due to : ${e}`)
      });

    logger.info(`Removed ${noOfKeysRemoved} from the cache`);

    return 'OK'
  }

  async getTeamScore(team) {
    let cachedHistory = await this.client.get('buttonHistory')
      .catch(logger.info('No button press history found. Must be the first button press ?'));

    let score = 0;
    if (cachedHistory === null) {
      return score
    }

    let history = JSON.parse(cachedHistory);

    let teamHistory = history
      .filter(history => history['team'] === team);

    if (teamHistory.length !== 0) {
      score = teamHistory
        .map(x => x.score)
        .reduce((prev, curr) => prev + curr);
    }

    return score;
  }

  async getScore(day) {
    // Find all the entries for the current day and -1 ... e.g. first button press = no of teams - no of button presses
    let cachedHistory = await this.client.get('buttonHistory')
      .catch(logger.info('No button press history found. Must be the first button press ?'));

    if (cachedHistory === null) {
      return this.noOfTeams
    }

    let history = JSON.parse(cachedHistory);

    let dayHistory = history.filter(history => history['day'] === day);

    return this.noOfTeams - dayHistory.length
  }

  getTeam(buttonNumber, day) {
    // Based on the formula:
    // Team = Button - Day

    const offset = Number(buttonNumber) - Number(day);
    return ( Number(offset) <= 0 ) ? Number(offset) + Number(this.noOfTeams) : offset;
  }

  getButton(teamNumber, day) {
    // Based on the formula:
    // Button = Day + Team

    const offset = Number(teamNumber) + Number(day);
    return ( Number(offset) > Number(this.noOfTeams) ) ? Number(offset) - Number(this.noOfTeams) : offset;
  }

  async getStanding() {
    let team = 1;
    let teamScores = [];

    let cachedHistory = await this.client.get('buttonHistory')
      .catch(logger.info('No button press history found... returning empty list'));

    if (cachedHistory === null) {
      return []
    }

    let history = JSON.parse(cachedHistory);

    while (team < this.noOfTeams + 1) {

      let teamHistory = history
        .filter(history => history['team'] === team);

      if (teamHistory.length !== 0) {
        const score = teamHistory
          .map(x => x.score)
          .reduce((prev, curr) => prev + curr);

        teamScores.push({name: team, score})
      } else {
        teamScores.push({name: team, score: 0})
      }

      team++;
    }

    teamScores.sort((a, b) => b.score - a.score);

    return teamScores;
  }

  async pressButtonOnly(buttonNumber) {
    const day = await this.getDay();
    const team = this.getTeam(buttonNumber, day);
    const score = await this.getScore(day);

    if (day === -1) {
      return { error : true}
    }

    return this.pressButton(buttonNumber, team, day, score);
  }

  async pressButton(buttonNumber, team, day, score) {
    let history = [];

    let cachedHistory = await this.client.get('buttonHistory')
      .catch(logger.info('No button press history found, will start a new history log'));

    if (cachedHistory !== null) {
      history = JSON.parse(cachedHistory);
    }

    let buttonAlreadyPushedHistory = history
      .filter(x => x.button === buttonNumber)
      .filter(y => y.team === team)
      .filter(z => z.day === day);

    if (buttonAlreadyPushedHistory.length !== 0) {

      logger.info(`Button ${buttonNumber} for team ${team} has already been pressed today.  Action will not be recorded`);
      return {"team": team, "button": buttonNumber, "day": day, "time": moment().format('HH:mm:ss'), "score": 0}

    } else {

      history.push({
        "team": team,
        "button": buttonNumber,
        "day": day,
        "time": moment().format('HH:mm:ss'),
        "score": score
      });

      await this.client.set('buttonHistory', JSON.stringify(history))
        .catch((e) => {
          logger.error(`Call to pressButton failed when setting buttonHistory due to : ${e}`)
        });

      return {"team": team, "button": buttonNumber, "day": day, "time": moment().format('HH:mm:ss'), "score": score}
    }
  }

  async progress() {
    let history = [];

    let cachedHistory = await this.client.get('buttonHistory')
      .catch(logger.info('No button press history found, will start a new history log'));

    if (cachedHistory !== null) {
      history = JSON.parse(cachedHistory);
    }

    let percentage = 100 / Number(this.noOfTeams) * history.length;
    let nextButton =  history.length + 1;
    let finished = false;
    if (nextButton > this.noOfTeams) {
      finished = true;
    }

    return { percentage, nextButton, finished }
  }
};
