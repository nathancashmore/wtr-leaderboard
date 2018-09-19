const express = require('express');
const router = express.Router();

const Helper = require('../helper/data-helper');
const helper = new Helper();

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
