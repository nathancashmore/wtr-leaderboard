const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  const standing = await req.app.locals.dataHelper.getStanding();
  res.render('index', { standing });
});

router.get('/score-table', async (req, res) => {
  const standing = await req.app.locals.dataHelper.getStanding();
  res.render('partials/score-table', { standing });
});

module.exports = router;
