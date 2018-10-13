const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
  let progress = await req.app.locals.dataHelper.progress();

  res.render('progress', {  "data" : progress } )
});

router.get('/update', async function (req, res, next) {
  let progress = await req.app.locals.dataHelper.progress();

  res.render('progress', {  "data" : progress } )
});

module.exports = router;