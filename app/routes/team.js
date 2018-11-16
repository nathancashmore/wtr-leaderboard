const express = require('express');

const router = express.Router();

router.get('/:team', async (req, res) => {
  const team = Number(req.params.team);

  const day = await req.app.locals.dataHelper.getDay();
  const button = req.app.locals.dataHelper.getButton(team, day);
  const score = await req.app.locals.dataHelper.getTeamScore(team);

  res.render('team', {
    team, button, score,
  });
});

module.exports = router;
