const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    res.render('progress', { total: 0.2 } )
});

module.exports = router;
