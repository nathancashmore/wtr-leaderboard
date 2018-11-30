const express = require('express');
const i18n = require('i18n');
const logger = require('heroku-logger');

const router = express.Router();

async function getScore(req) {
  const standing = await req.app.locals.dataHelper.getStanding();
  return standing.map(x => ({ team: i18n.__(`team-${x.name}`), score: x.score }));
}

router.post('/', async (req, res) => {
  logger.info(`Slack request received for [${req.body.text}]`);

  switch (req.body.text) {
    case 'score':
      res.json(await getScore(req));
      break;
    default:
      res.sendStatus(404);
  }
});


module.exports = router;
