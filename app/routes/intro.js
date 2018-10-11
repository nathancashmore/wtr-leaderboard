const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    let noOfTeams = req.app.locals.dataHelper.getNoOfTeams();
    res.render('intro', { title: 'Christmas IoT Hunt', noOfTeams: noOfTeams, noOfTeamsLessOne: noOfTeams - 1})
});

module.exports = router;
