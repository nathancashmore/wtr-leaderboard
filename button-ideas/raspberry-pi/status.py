#! /usr/bin/env python

# You need to install the required libraries. To do so do:
# sudo apt-get update
# sudo apt-get install python-pip
# sudo pip install requests

import time
import requests
import socket
import json

url = 'https://iot-hunt.herokuapp.com/status'
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}

def getIp():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address

def loop():
    while True:
        data = {'button': ButtonNumber, 'ip': getIp()}
        r = requests.put(url, headers=headers, data=json.dumps(data))
        print(r.json)
        time.sleep(540)   # Wait for 9 mins

def destroy():
    print("Status closing")

if __name__ == '__main__':     # Program start from here
    ButtonNumber = socket.gethostname().split("-")[1]

    print("Button number determined as : " + str(ButtonNumber))
    print("IP determined as : " + str(getIp()))

    try:
        loop()
    except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
        destroy()