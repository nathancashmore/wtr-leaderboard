const express = require('express');
const logger = require('heroku-logger');
const router = express.Router();

const TEST_BUTTON_NUMBER = 69;

router.get('/v1/status', async function (req, res, next) {
  if(validateRequest(req) === true) {
    res.json({status: "OK"})
  } else {
    res.status(401);
    res.json({ error : 'Invalid IFTTT-Service-Key'})
  }
});

router.post('/v1/test/setup', async function (req, res, next) {
  logger.info('IFTTT are about to carry out a test');
  res.json({
    "data": {
      "samples": {
        "actions": {
          "press_button": {
            "number": TEST_BUTTON_NUMBER
          }
        }
      }
    }
  })
});

router.post('/v1/actions/press_button', async function (req, res, next) {

  let buttonNumber = req.body.actionFields.number;

  logger.info(`IFTTT call received to press button number ${buttonNumber}`);

  if (buttonNumber === TEST_BUTTON_NUMBER) {
    logger.info('Ignoring request from IFTTT as test button number found')
  } else {
    logger.info(`Pushing button number ${buttonNumber} based on request from IFTTT`)
    await req.app.locals.dataHelper.pressButtonOnly(buttonNumber);
  }

  res.json({data: [ {id: "11111", url: "https://iot-hunt.herokuapp.com"}]})
});

function validateRequest(req) {
  return req.get('IFTTT-Service-Key') === req.app.locals.iftttAuthCode;
}

module.exports = router;
