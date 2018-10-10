const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let standing = await req.app.locals.dataHelper.getStanding();
  res.render('index', { standing: standing})
});

router.get('/score-table', async function(req, res, next) {
    let standing = await req.app.locals.dataHelper.getStanding();
    res.render('partials/score-table', { standing: standing})
});

module.exports = router;
