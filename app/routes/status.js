const express = require('express');
const i18n = require('i18n');

const router = express.Router();

router.get('/', async (req, res) => {
  const status = await req.app.locals.dataHelper.getStatus();
  res.render('status', { title: i18n.__('title'), status });
});

module.exports = router;
