const express = require('express');
const router = express.Router();

router.get('/:team', async function(req, res, next) {
  const team = Number(req.params.team);
  let gameOver = false;

  const day = await req.app.locals.dataHelper.getDay();
  const button = req.app.locals.dataHelper.getButton(team, day);
  const score = await req.app.locals.dataHelper.getTeamScore(team);

  if(day === -1) {
    gameOver = true;
  }

  res.render('team', { gameOver, team, button, score})
});

module.exports = router;
