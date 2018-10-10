#! /usr/bin/env python

# You need to install the required libraries. To do so do:
# sudo apt-get update
# sudo apt-get install python-pip
# sudo pip install requests

import RPi.GPIO as GPIO
import time
import requests

GPIO.setmode(GPIO.BCM)

GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP)#Button to GPIO23
GPIO.setup(24, GPIO.OUT)  #LED to GPIO24

url = 'https://iot-hunt.herokuapp.com/buttons/1'
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}

try:
    while True:
        button_state = GPIO.input(23)
        if button_state == False:
            GPIO.output(24, True)
            print('Button Pressed...')
            r = requests.post(url, headers=headers)
            print(r.json)
            time.sleep(0.2)
        else:
            GPIO.output(24, False)
except:
    GPIO.cleanup()