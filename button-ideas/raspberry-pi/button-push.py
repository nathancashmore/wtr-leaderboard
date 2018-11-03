#! /usr/bin/env python

# You need to install the required libraries. To do so do:
# sudo apt-get update
# sudo apt-get install python-pip
# sudo pip install requests

import RPi.GPIO as GPIO
import time
import requests
import socket

ButtonNumber = socket.gethostname().split("-")[1]

print("Button number determined as : " + str(ButtonNumber))

LedPin = 11    # pin11 --- led
BtnPin = 12    # pin12 --- button

Led_status = 1

url = 'https://iot-hunt.herokuapp.com/buttons/' + str(ButtonNumber)
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}

def setup():
    GPIO.setmode(GPIO.BOARD)       # Numbers GPIOs by physical location
    GPIO.setup(LedPin, GPIO.OUT)   # Set LedPin's mode is output
    GPIO.setup(BtnPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)    # Set BtnPin's mode is input, and pull up to high level(3.3V)
    GPIO.output(LedPin, GPIO.LOW) # Set LedPin high(+3.3V) to off led

def swLed(ev=None):
    global Led_status

    GPIO.output(LedPin, GPIO.HIGH)

    r = requests.post(url, headers=headers)
    print(r.json)

    time.sleep(1)

    GPIO.output(LedPin, GPIO.LOW)

def loop():
    GPIO.add_event_detect(BtnPin, GPIO.RISING, callback=swLed, bouncetime=5000)
    while True:
        time.sleep(2)   # Don't do anything

def destroy():
    GPIO.output(LedPin, GPIO.LOW)
    GPIO.cleanup()

if __name__ == '__main__':     # Program start from here
    setup()
    try:
        loop()
    except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
        destroy()