const express = require('express');
const i18n = require('i18n');
const logger = require('heroku-logger');

const router = express.Router();

function formatForSlack(standing) {
  let text = '';
  let idx = 1;

  standing.forEach((x) => {
    text = `${text}${idx}. _${x.team}_ - *${x.score}pts*`;
    text = `${text}\n`;
    idx += 1;
  });

  return {
    attachments: [
      {
        title: i18n.__('slack.title'),
        pretext: i18n.__('slack.pretext'),
        text,
        mrkdwn_in: [
          'text',
          'pretext'
        ]
      }
    ]
  };
}

async function getScore(req) {
  const standing = await req.app.locals.dataHelper.getStanding();
  const standingWithContent = standing.map(x => ({ team: i18n.__(`team-${x.name}`), score: x.score }));
  return formatForSlack(standingWithContent);
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
