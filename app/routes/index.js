const express = require('express');
const router = express.Router();
const standing = require('../data/standing');
const Helper = require('../helper/data-helper');

const helper = new Helper();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Christmas IoT Hunt', standing: helper.getStanding()})
});

module.exports = router;
