![leaderboard logo](http://iot-hunt.herokuapp.com/images/ChristmasIoTLeaderboard.png "Christmas IoT Hunt Leaderboard")

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
| ```POST``` | ```/buttons/<button-number>```| -- N.B. Must include header Content-Type application/json | Adds a record to the button press history |	
| ```PUT```  | ```/status```                 | ```{"button": "1", "ip": "10.10.0.99" }```  | Used to report the status of a button and disclose its IP address |	
| ```PATCH```| ```/status/clear```           | --                                    | Clears all the button status information |	
| ```GET```  | ```/slack```                  | { "text" : "status" }                 | Returns Slack formatted response for Slack slash command |

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

* [Leaderboard - http://localhost:3000](http://localhost:3000)
* [Introduction - http://localhost:3000/intro](http://localhost:3000/intro)

## Deployment
This is currently being deployed to [Heroku](https://iot-hunt.herokuapp.com/intro)

## Configuration



## Button Ideas

### ![RaspPiLogo] Raspberry Pi
Python scripts for use with a Raspberry Pi can be found in the ```button-ideas/raspberry-pi``` directory.

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

#### status.sh
This can be run as a cron job to check the button-push process is running.  To do this add ```status.sh``` to the
pi users home directory and then the following crontab entry using ```crontab -e```

```
*/10 * * * * /home/pi/status.sh
```

Any additional requirements for the scripts can be found in a comment at the top of each file.
The diagram below details how to wire a button based on the script.

![ButtonPushWiring]

### ![IFTTTLogo]
IFTTT is a free platform that helps you do more with all your apps and devices.  You can create your own Applets and
Services which tie together different IoT devices.  Endpoints in the application have been added to allow the 
creation of a IFTTT service.  As such you could use the service with an another IoT associated device.

![IFTTTApplet]

### ![GoogleVRLogo]
Google VR provides SDKs for many popular development environments. These SDKs provide native APIs for key VR features 
like user input, controller support, and rendering, which you can use to build new VR experiences on either Daydream or Cardboard.
Being able to capture the users action we can then call the REST API endpoint to push the button.

### ![MinecraftLogo]
Minecraft provides a virtual 8-bit world of blocks and items you can use to build pretty much anything.  Think of it 
like the latest version of LEGO.
CraftBukkit is lightly modified version of the Vanilla minecraft software allowing it to be able to run Bukkit plugins.
Bukkit is an API that allows programmers to make plugins for server software.  Spigot is the most popular used Minecraft 
server software in the world. Spigot is a modified version of CraftBukkit with hundreds of improvements and optimizations 
that can only make CraftBukkit shrink in shame.
By progamming a Bukkit plugin you can trigger the sending of a REST API call to push the button when an event 
or command is triggered in Minecraft.  

### ![SlackLogo]
Slack is a cloud-based proprietary instant messaging platform developed by Slack Technologies.  If you or your company already
use Slack for messaging then its relatively easy to create a [Slack App](https://api.slack.com/apps) for your workspace.

An endpoint has been provided that will return markdown detailing the latest scores.

```
curl --request POST \
     --url http://localhost:3000/slack \
     --header 'Content-Type: application/json' \
     --data '{ "text": "score" }'
```

This endpoint may then be used in a [Slack Command](https://api.slack.com/interactivity/slash-commands) to provide a live update
of the scoreboard.  Just specify the Request URL as http://your.site.address/slack on a new app for example called `leaderboard`
and then you can issue the command:
```
/leaderboard score
```
to get the latest results.


## References

https://platform.ifttt.com/docs/applets

https://www.raspberrypi.org/blog/button/

https://developers.google.com/vr/?hl=en

https://www.spigotmc.org/wiki/spigot/

https://api.slack.com/

https://bukkit.gamepedia.com/Plugin_Tutorial

[ButtonPushWiring]: http://iot-hunt.herokuapp.com/images/button-push-diagram.png "Button Push wiring"
[GoogleVRLogo]: http://iot-hunt.herokuapp.com/images/GoogleVRLogo.png "Google VR"
[RaspPiLogo]: http://iot-hunt.herokuapp.com/images/RaspPiLogo.png "Raspberry Pi"
[IFTTTLogo]: http://iot-hunt.herokuapp.com/images/IFTTTLogo.png "IFTTT"
[IFTTTApplet]: http://iot-hunt.herokuapp.com/images/IFTTTApplet.png "IFTTT Applet"
[MinecraftLogo]: http://iot-hunt.herokuapp.com/images/MinecraftLogo.png "Minecraft"
[SlackLogo]: http://iot-hunt.herokuapp.com/images/SlackLogo.png "Slack"

