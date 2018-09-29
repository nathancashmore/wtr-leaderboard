const logger = require('heroku-logger');
const express = require('express');
const router = express.Router();

router.patch('/clear', async function (req, res, next) {

  let status = await req.app.locals.dataHelper.clearHistory()
    .catch((e) => logger.error(`Call to clear failed due to : ${e}`));

  res.json({status});
});

module.exports = router;
