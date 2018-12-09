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

router.put('/window', async (req, res) => {
  const windowInfo = {
    start: req.body.start,
    end: req.body.end,
    penalty: req.body.penalty
  };

  await req.app.locals.dataHelper.setWindow(windowInfo);

  res.json(windowInfo);
});

router.patch('/window/clear', async (req, res) => {
  const status = await req.app.locals.dataHelper.clearWindow()
    .catch(e => logger.error(`Call to clear window failed due to : ${e}`));

  res.json({ status });
});

module.exports = router;
