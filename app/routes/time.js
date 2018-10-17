const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
  const { startDate } = req.body;
  await req.app.locals.dataHelper.setStartDate(startDate);
  res.json({ startDate });
});

router.get('/', async (req, res) => {
  let day = await req.app.locals.dataHelper.getDay();

  // Not really sure about this but it covers NaN and dates in the past
  if (!(day > -1)) {
    day = -1;
  }
  res.json({ day });
});

module.exports = router;
