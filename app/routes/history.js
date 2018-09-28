const express = require('express');
const router = express.Router();

router.patch('/clear', async function(req, res, next) {
    let status = await req.app.locals.dataHelper.clearHistory();
    res.json({ status });
});

module.exports = router;
