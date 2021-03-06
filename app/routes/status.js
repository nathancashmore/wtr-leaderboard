const express = require('express');
const i18n = require('i18n');
const moment = require('moment');
const logger = require('heroku-logger');

const router = express.Router();

router.get('/', async (req, res) => {
  const status = await req.app.locals.dataHelper.getStatus();

  const contentType = req.get('Content-Type');

  if (contentType === 'application/json') {
    if (status) {
      status.filter(x => x.indicator === 'red');
      if (status.length > 1) { res.status(410); } else { res.status(200); }
    }
    res.json();
  } else {
    res.render('status', { title: i18n.__('title'), status });
  }
});

router.put('/', async (req, res) => {
  const statusInfo = {
    button: req.body.button,
    ip: req.body.ip,
    time: moment().format('YYYY-MM-DD HH:mm')
  };

  await req.app.locals.dataHelper.addStatus(statusInfo);

  res.json(statusInfo);
});

router.patch('/clear', async (req, res) => {
  const status = await req.app.locals.dataHelper.clearStatus()
    .catch(e => logger.error(`Call to clear status failed due to : ${e}`));

  res.json({ status });
});

module.exports = router;
