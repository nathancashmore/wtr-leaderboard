const express = require('express');
const router = express.Router();

const METHOD_NOT_ALLOWED = 405;

router.post('/:button', async function(req, res, next) {
	const button = Number(req.params.button);

	const day = await req.app.locals.dataHelper.getDay();
	const team = req.app.locals.dataHelper.getTeam(button, day);
	const score = await req.app.locals.dataHelper.getScore(day);

	let result = {};

  if ( day === -1) {
    res.status(METHOD_NOT_ALLOWED);
  } else {
    result = await req.app.locals.dataHelper.pressButton(button, team, day, score);
	}

	res.json(result);
});

router.get('/', async function(req, res, next) {
    res.render('buttons', { percentFound: 40, foundNum: 2, totalNum: 5 })
});

module.exports = router;
