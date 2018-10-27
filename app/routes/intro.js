const express = require('express');
const i18n = require('i18n');

const router = express.Router();

router.get('/', async (req, res) => {
  const noOfTeams = req.app.locals.dataHelper.getNoOfTeams();
  res.render('intro', { title: i18n.__('title'), noOfTeams, noOfTeamsLessOne: noOfTeams - 1 });
});

module.exports = router;
