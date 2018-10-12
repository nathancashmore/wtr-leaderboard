const express = require('express');
const router = express.Router();

const METHOD_NOT_ALLOWED = 405;

router.post('/:button', async function (req, res, next) {
  const button = Number(req.params.button);
  const result = await req.app.locals.dataHelper.pressButtonOnly(button);

  if(result.error) {
    res.status(METHOD_NOT_ALLOWED);
  }
  res.json(result);
});

router.get('/', async function(req, res, next) {
    res.render('buttons', { percentFound: 40, foundNum: 2, totalNum: 5 })
});

module.exports = router;
