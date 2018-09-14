# Christmas iOt

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
GET button/<number>?token=xxxxxxx

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

