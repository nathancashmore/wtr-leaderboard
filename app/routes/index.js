const express = require('express');
const router = express.Router();
const Helper = require('../helper/data-helper');

const helper = new Helper();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let standing = await helper.getStanding();
  res.render('index', { title: 'Christmas IoT Hunt', standing: standing})
});

module.exports = router;
