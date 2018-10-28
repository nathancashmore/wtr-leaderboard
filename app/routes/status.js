const express = require('express');
const i18n = require('i18n');
const moment = require('moment');

const router = express.Router();

router.get('/', async (req, res) => {
  const status = await req.app.locals.dataHelper.getStatus();
  res.render('status', { title: i18n.__('title'), status });
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

module.exports = router;
