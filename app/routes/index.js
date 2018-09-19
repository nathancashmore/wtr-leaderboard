const express = require('express');
const DataHelper = require('../helper/data-helper');
const config = require('getconfig');
const router = express.Router();

const helper = new DataHelper(config.DATA_DIR, config.NO_OF_TEAMS, config.REDISCLOUD_URL);

/* GET home page. */
router.get('/', async function(req, res, next) {
  let standing = await helper.getStanding();
  res.render('index', { title: 'Christmas IoT Hunt', standing: standing})
});

router.get('/score-table', async function(req, res, next) {
    let standing = await helper.getStanding();
    res.render('partials/score-table', { standing: standing})
});

module.exports = router;
