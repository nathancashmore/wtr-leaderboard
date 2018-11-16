const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
  const { startDate } = req.body;
  await req.app.locals.dataHelper.setStartDate(startDate);
  res.json({ startDate });
});

router.get('/', async (req, res) => {
  const day = await req.app.locals.dataHelper.getDay();
  res.json({ day });
});

module.exports = router;
