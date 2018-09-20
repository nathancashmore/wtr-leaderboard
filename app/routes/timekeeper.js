const express = require('express');
const router = express.Router();

router.post('/', async function(req, res, next) {
    const startDate = req.body.start;
    await req.app.locals.dataHelper.setStartDate(startDate);
    res.json({ startDate });
});

router.get('/', async function(req, res, next) {
    const day = await req.app.locals.dataHelper.getDay();
    res.json({ day });
});

module.exports = router;
