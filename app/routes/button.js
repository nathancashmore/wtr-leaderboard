const express = require('express');
const logger = require('heroku-logger');

const router = express.Router();

const METHOD_NOT_ALLOWED = 405;

router.post('/:button', async (req, res) => {
  const button = Number(req.params.button);
  const result = await req.app.locals.dataHelper.pressButtonOnly(button);

  if (result instanceof Error) {
    logger.error(result.message);
    res.status(METHOD_NOT_ALLOWED);
  }
  res.json(result);
});

module.exports = router;
