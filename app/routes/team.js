const express = require('express');
const i18n = require('i18n');
const boom = require('boom');

const router = express.Router();

router.get('/:team', async (req, res, next) => {
  const team = Number(req.params.team);
  const day = await req.app.locals.dataHelper.getDay();

  if (day < 0 || team < 1 || team > req.app.locals.dataHelper.noOfTeams) {
    next(boom.notFound());
    return;
  }

  const button = req.app.locals.dataHelper.getButton(team, day);
  const score = await req.app.locals.dataHelper.getTeamScore(team);

  const contentType = req.get('Content-Type');

  if (contentType === 'application/json') {
    const teamName = i18n.__(`team-${team}`);
    const buttonName = i18n.__(`button-name-${button}`);
    const clue = i18n.__(`button-clue-${button}`);

    res.json({
      team: teamName, button: buttonName, clue, score
    });
  } else {
    res.render('team', { team, button, score });
  }
});

module.exports = router;
