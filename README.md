# Dublin-Bikes-App

<img src="/images/splash.png" align="center" />

## Table of contents
<img src="/images/readme.png" align="right" />

* [General info](#general-info)
* [Requirement and Setup](#setup)!
* [Technologies](#technologies)


## General info
A web app to track the number of bikes in each depot around Dublin. It can also predict the number of bikes at each depot based on time of day and weather data.

- Functional features
  - map centered to Dublin City
  - zoom
  - Full screen mode
  - light/dark mode
  - available bike/stands mode. Data updated every 5 minutes
  - dropdown menu to select bike stations
  - Window pop-up with station information
  - 3 graphs:
    - graph 1: average daily availibility for 1 week Monday-Sunday
    - graph 2: average hourly availibility for each day of the week
    - graph 3: 5 days forecast with 3 hours interval (updated every 3 hours)

##Requirement and setup

1. Python and requirements
```
$ pyvenv-3.7 env
$ source env/bin/activate
$ pip install -r requirements.txt
```

2. Clone it!

```
$ git clone git https://github.com/AdamMcCarthyCompSci/Dublin-Bikes-App.git'''
```

3. Run

Go into the project directory and run the command:
```$ python app.py```

4. Open http://localhost:5000 and enjoy!

<img src="/images/finalscreen.png" align="center" />

##Technologies

Python 3.7
Javascript
jQuery
HTML 5
Json
Google Visualisation API https://developers.google.com/chart
Google Maps Platform API https://developers.google.com/maps
Weather API from https://openweathermap.org/ (live and forecast)
JCDecaux Developer API https://developer.jcdecaux.com/
My SQL Benchmark
Amazon Web Services (AWS): EC2 and RDS
Flask





Contributors

