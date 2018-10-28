#! /usr/bin/env python

# You need to install the required libraries. To do so do:
# sudo apt-get update
# sudo apt-get install python-pip
# sudo pip install requests

import time
import requests
import socket

ButtonNumber = socket.gethostname().split("-")[1]

print("Button number determined as : " + str(ButtonNumber))

url = 'https://iot-hunt.herokuapp.com/status/' + str(ButtonNumber)
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}

def loop():
    while True:
        r = requests.post(url, headers=headers)
        print(r.json)
        time.sleep(540)   # Wait for 9 mins

def destroy():
    print("Status closing")

if __name__ == '__main__':     # Program start from here
    try:
        loop()
    except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
        destroy()