const logger = require('heroku-logger');
const moment = require('moment');
const asyncRedis = require('async-redis');

module.exports = class DataHelper {
  constructor(noOfTeams, redisUrl) {
    logger.info(`Total number of teams set to : ${noOfTeams}`);
    logger.info(`Redis URL set  to: ${redisUrl}`);

    this.noOfTeams = noOfTeams;
    this.client = asyncRedis.createClient(redisUrl, { no_ready_check: true });
  }

  getNoOfTeams() {
    return this.noOfTeams;
  }

  async setStartDate(startDate) {
    await this.client.set('startDate', startDate)
      .catch((e) => {
        logger.error(`Call to setStartDate failed due to : ${e}`);
      });
  }

  async getDay() {
    const startDate = await this.client.get('startDate')
      .catch((e) => {
        logger.error(`Call to getDay failed due to : ${e}`);
      });

    const day = moment().diff(moment(startDate, 'YYYY-MM-DD'), 'days');

    return (!(day > -1) || day >= this.noOfTeams) ? -1 : day;
  }

  async clearHistory() {
    const noOfKeysRemoved = await this.client.del('buttonHistory')
      .catch((e) => {
        logger.error(`Call to delete buttonHistory failed due to : ${e}`);
      });

    logger.info(`Removed ${noOfKeysRemoved} from the cache`);

    return 'OK';
  }

  async getTeamScore(team) {
    const cachedHistory = await this.client.get('buttonHistory')
      .catch((e) => {
        logger.info(`No button press history found : ${e}`);
      });

    let score = 0;
    if (cachedHistory === null) {
      return score;
    }

    const history = JSON.parse(cachedHistory);

    const teamHistory = history
      .filter(x => x.team === team);

    if (teamHistory.length !== 0) {
      score = teamHistory
        .map(x => x.score)
        .reduce((prev, curr) => prev + curr);
    }

    return score;
  }

  async getScore(day) {
    // Find all the entries for the current day and -1 ...
    // e.g. first button press = no of teams - no of button presses
    const cachedHistory = await this.client.get('buttonHistory')
      .catch((e) => {
        logger.info(`No button press history found : ${e}`);
      });

    if (cachedHistory === null) {
      return this.noOfTeams;
    }

    const history = JSON.parse(cachedHistory);

    const dayHistory = history.filter(x => x.day === day);

    return this.noOfTeams - dayHistory.length;
  }

  getTeam(buttonNumber, day) {
    // Based on the formula:
    // Team = Button - Day

    const offset = Number(buttonNumber) - Number(day);
    return (Number(offset) <= 0) ? Number(offset) + Number(this.noOfTeams) : offset;
  }

  getButton(teamNumber, day) {
    // Based on the formula:
    // Button = Day + Team

    const offset = Number(teamNumber) + Number(day);
    return (Number(offset) > Number(this.noOfTeams))
      ? Number(offset) - Number(this.noOfTeams) : offset;
  }

  async getStanding() {
    let team = 1;
    const teamScores = [];

    const cachedHistory = await this.client.get('buttonHistory')
      .catch((e) => {
        logger.info(`No button press history found : ${e}`);
      });

    if (cachedHistory === null) {
      return [];
    }

    const history = JSON.parse(cachedHistory);

    while (team < this.noOfTeams + 1) {
      const teamIndex = team;
      const teamHistory = history.filter(x => x.team === teamIndex);

      if (teamHistory.length !== 0) {
        const score = teamHistory
          .map(x => x.score)
          .reduce((prev, curr) => prev + curr);

        teamScores.push({ name: team, score });
      } else {
        teamScores.push({ name: team, score: 0 });
      }

      team += 1;
    }

    teamScores.sort((a, b) => b.score - a.score);

    return teamScores;
  }

  async pressButtonOnly(buttonNumber) {
    const day = await this.getDay();
    const team = this.getTeam(buttonNumber, day);
    const score = await this.getScore(day);

    if (day === -1) {
      return { error: true };
    }

    return this.pressButton(buttonNumber, team, day, score);
  }

  async pressButton(buttonNumber, team, day, score) {
    let history = [];

    const cachedHistory = await this.client.get('buttonHistory')
      .catch((e) => {
        logger.info(`No button press history found : ${e}`);
      });

    if (cachedHistory !== null) {
      history = JSON.parse(cachedHistory);
    }

    const buttonAlreadyPushedHistory = history
      .filter(x => x.button === buttonNumber)
      .filter(y => y.team === team)
      .filter(z => z.day === day);

    if (buttonAlreadyPushedHistory.length !== 0) {
      logger.info(`Button ${buttonNumber} for team ${team} has already been pressed today.  Action will not be recorded`);
      return {
        team, button: buttonNumber, day, time: moment().format('HH:mm:ss'), score: 0,
      };
    }

    history.push({
      team,
      button: buttonNumber,
      day,
      time: moment().format('HH:mm:ss'),
      score,
    });

    await this.client.set('buttonHistory', JSON.stringify(history))
      .catch((e) => {
        logger.error(`Call to pressButton failed when setting buttonHistory due to : ${e}`);
      });

    return {
      team, button: buttonNumber, day, time: moment().format('HH:mm:ss'), score,
    };
  }

  async progress() {
    let history = [];

    const cachedHistory = await this.client.get('buttonHistory')
      .catch((e) => {
        logger.info(`No button press history found : ${e}`);
      });

    if (cachedHistory !== null) {
      history = JSON.parse(cachedHistory);
    }

    const percentage = 100 / Number(this.noOfTeams) * history.length;
    const nextButton = history.length + 1;
    let finished = false;
    if (nextButton > this.noOfTeams) {
      finished = true;
    }

    return { percentage, nextButton, finished };
  }

  async addStatus(statusInfo) {
    let buttonStatus = [];
    const statusInfoJson = statusInfo;

    const cachedStatus = await this.client.get('buttonStatus')
      .catch((e) => {
        logger.info(`No button status found : ${e}`);
      });

    if (cachedStatus !== null) {
      buttonStatus = JSON.parse(cachedStatus);
    }

    const filteredButtonStatus = buttonStatus.filter(x => x.button !== statusInfo.button);
    filteredButtonStatus.push(statusInfoJson);

    await this.client.set('buttonStatus', JSON.stringify(filteredButtonStatus))
      .catch((e) => {
        logger.error(`Call to addStatus failed when setting buttonStatus due to : ${e}`);
      });
  }

  async getStatus() {
    const dateTimeNow = moment();

    const statusRaw = await this.client.get('buttonStatus')
      .catch((e) => {
        logger.error(`Call to getStatus failed due to : ${e}`);
      });

    let status = JSON.parse(statusRaw);

    const enrichedStatus = [];

    if (status) {
      status.forEach((s) => {
        const noOfMinutesSinceButtonWasPressed = moment(s.time, 'YYYY-MM-DD HH:mm').diff(dateTimeNow, 'minutes');
        let determinedStatus;

        if (noOfMinutesSinceButtonWasPressed > -10) {
          determinedStatus = 'green';
        } else if (noOfMinutesSinceButtonWasPressed > -30) {
          determinedStatus = 'yellow';
        } else {
          determinedStatus = 'red';
        }

        const newInfo = s;
        newInfo.indicator = determinedStatus;
        enrichedStatus.push(newInfo);
      });

      status = enrichedStatus;
    }

    return status;
  }
};
