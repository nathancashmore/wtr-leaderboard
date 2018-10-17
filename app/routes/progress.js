const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const progress = await req.app.locals.dataHelper.progress();

  res.render('progress', { data: progress });
});

router.get('/update', async (req, res) => {
  const progress = await req.app.locals.dataHelper.progress();

  res.render('partials/progress-bar', { data: progress });
});

module.exports = router;
