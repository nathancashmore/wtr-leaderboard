![leaderboard logo](https://raw.githubusercontent.com/nathancashmore/wtr-leaderboard/master/public/images/ChristmasIoTLeaderboard.png?token=ABz_XYXRAWHHkHSyRqbUEiWiHkxx8GLzks5bpYmuwA%3D%3D&_sm_au_=iVVJ6QkrJBQkvNWs "Christmas IoT Hunt Leaderboard")

![Build Status](https://camo.githubusercontent.com/18b9991b8d293d6ce648e28cc273ccdfdcbdffaa/68747470733a2f2f7472617669732d63692e636f6d2f6e617468616e636173686d6f72652f7774722d6c6561646572626f6172642e7376673f746f6b656e3d784a384a795271586f624578586b384c63486341266272616e63683d6d6173746572?_sm_au_=iVVZfNPkkLqVLsVt "https://travis-ci.com/nathancashmore/wtr-leaderboard")

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
## Test
```
npm test
```
## Run
```
npm start
```
