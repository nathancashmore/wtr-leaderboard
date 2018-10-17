const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const noOfTeams = req.app.locals.dataHelper.getNoOfTeams();
  res.render('intro', { title: 'Christmas IoT Hunt', noOfTeams, noOfTeamsLessOne: noOfTeams - 1 });
});

module.exports = router;
