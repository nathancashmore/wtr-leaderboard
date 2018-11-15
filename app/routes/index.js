const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  const standing = await req.app.locals.dataHelper.getStanding();
  const day = await req.app.locals.dataHelper.getDay();
  const eventState = await req.app.locals.dataHelper.getEventState();

  res.render('index', { standing, day, eventState });
});

router.get('/score-table', async (req, res) => {
  const standing = await req.app.locals.dataHelper.getStanding();
  res.render('partials/score-table', { standing });
});

module.exports = router;
