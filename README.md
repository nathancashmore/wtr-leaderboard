![leaderboard logo](https://raw.githubusercontent.com/nathancashmore/wtr-leaderboard/master/public/images/ChristmasIoTLeaderboard.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "Christmas IoT Hunt Leaderboard")

# Christmas IoT Hunt Leaderboard

## Overview

Create a leaderboard to display results from the '10 days of Christmas' event.
In the event 10 iot devices will be hidden around / near the office.  Each team
will have to find the button on a particular day and press the button.

Points will be awarded to the team when their days button is pressed.  The points
total will be displayed on a leaderboard (this !!)


## Rules

- First button to be pressed on any given day will recieve
10 points for the team, then 9 and so on.

- A button can only be pressed once per day.  So if button 2 is pressed twice it
will only add points to a team once.

## Requirements

* Endpoint to record a button press
```
GET button/<number>?token=xxxxxxx
```
- Button number will be associated with a team for that day.
- only one request per day will make anything happen

e.g.
```
Day 1

Team 1 - Button 1
Team 2 - Button 2

... etc

Day 2
Team 1 - Button 2
Team 2 - Button 3
...

Team 9 = Button 10
Team 10 - Button 1
```
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
## Deploy
This is currently being deployed to [Heroku](https://iot-hunt.herokuapp.com/)

## iot scripts

This directory contains snippits of python code that can be
dropped onto a raspberry pi and used with a module to turn
it into an IoT device.
