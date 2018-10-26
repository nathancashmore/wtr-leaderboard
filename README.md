![leaderboard logo](https://raw.githubusercontent.com/nathancashmore/wtr-leaderboard/master/public/images/ChristmasIoTLeaderboard.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "Christmas IoT Hunt Leaderboard")

# Christmas IoT Hunt Leaderboard

## Overview

Create a leaderboard to display results from the '10 days of Christmas' event.
In the event 10 iot devices will be hidden around / near the office.  Each team
will have to find the button on a particular day and press the button.

Points will be awarded to the team when their days button is pressed.  The points
total will be displayed on a leaderboard (this !!)

## Rules

- Given 10 teams, the first button to be pressed on any given day will receive
10 points for the team, then 9 and so on.

- A button can only be pressed once per day.  So if button 2 is pressed twice it
will only add points to a team once.

- The button to be pressed by a team will change each day.  There will be as many buttons as teams.

## Endpoints

| Action     | Endpoint                      | Payload                               | Description |
| ---------- | ----------------------------  | ------------------------------------- | ----------- |
| ```GET```  | ```/time```                   | --                                    | Returns the current day number (0 indexed).  -1 returned if start date not set or hunt over. |
| ```POST``` | ```/time```                   | ```{ "startDate" : "YYYY-MM-DD" }```  | Set the start date |
| ```PATCH```| ```/history/clear```          | --                                    | Clears all button press history. |
| ```GET```  | ```/teams/<team-number>```    | --                                    | Returns the team information included current days button and clue |
| ```POST``` | ```/buttons/<button-number>```| --                                    | Adds a record to the button press history |	


### Prerequisites
* REDIS running locally
```
brew install redis
redis-server
```

## Test
```
npm test
```
## Run
```
npm start
```
## Deployment
This is currently being deployed to [Heroku](https://iot-hunt.herokuapp.com/)

## Hardware

### ![RaspPiLogo] Raspberry Pi
Python scripts for use with a Raspberry Pi can be found in the ```iot-scripts``` directory.

#### button-push.py
This combined with a simple button can be used to trigger a ```POST``` to the button
endpoint.   

To have the script start when the raspberry pi starts add 
them to the ```/etc/rc.local``` file.

e.g.
```
sudo -H -u pi /usr/bin/python /home/pi/button-push.py &
```

The script will determine the button number to use based on the hostname 
of the device.
e.g. 
```
button-5
```
To change the hostname, wifi setup or the ability to SSH to the device use
```
sudo raspi-config
```

Any additional requirements for the scripts can be found in a comment at the top of each file.
The diagram below details how to wire a button based on the script.

![ButtonPushWiring]

### ![IFTTTLogo]
IFTTT is a free platform that helps you do more with all your apps and devices.  You can create your own Applets and
Services which tie together different IoT devices.  Endpoints in the application have been added to allow the 
creation of a IFTTT service.  As such you could use the service with an another IoT associated device.

![IFTTTApplet]

## References

https://platform.ifttt.com/docs/applets

[ButtonPushWiring]: https://github.com/nathancashmore/wtr-leaderboard/blob/master/iot-scripts/button-push-diagram.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "Button Push wiring"
[GoogleVRLogo]: https://github.com/nathancashmore/wtr-leaderboard/blob/master/iot-scripts/GoogleVRLogo.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "Google VR"
[RaspPiLogo]: https://github.com/nathancashmore/wtr-leaderboard/blob/master/iot-scripts/RaspPiLogo.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "Raspberry Pi"
[IFTTTLogo]: https://github.com/nathancashmore/wtr-leaderboard/blob/master/iot-scripts/IFTTTLogo.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "IFTTT"
[IFTTTApplet]: https://github.com/nathancashmore/wtr-leaderboard/blob/master/iot-scripts/IFTTTApplet.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "IFTTT Applet"

