const express = require('express');
const config = require('getconfig');
const DataHelper = require('../helper/data-helper');

const router = express.Router();
const helper = new DataHelper(config.DATA_DIR, config.NO_OF_TEAMS, config.REDISCLOUD_URL);

router.post('/', async function(req, res, next) {
    const startDate = req.body.start;
    await helper.setStartDate(startDate);
    res.json({ startDate });
});

router.get('/', async function(req, res, next) {
    const day = await helper.getDay();
    res.json({ day });
});

module.exports = router;
