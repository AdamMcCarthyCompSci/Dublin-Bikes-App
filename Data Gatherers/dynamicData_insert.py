from sqlalchemy import Table, Column, Integer, Float, String, MetaData, DateTime, create_engine, types
from sqlalchemy.orm import sessionmaker
import requests
import json
import datetime
from IPython.display import JSON
import time

# Database info - Not separated since they are deployed directly to EC2
username = "DublinBikesApp"
password = "dublinbikesapp"
endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
port = "3306"
db = "DublinBikesApp"

# Get database connection
engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
    username, password, endpoint, port, db), echo=True)

meta = MetaData(engine)
conn = engine.connect()

# Create table
dynamicData = Table(
    'dynamicData', meta,
    Column('Insert_ID', Integer, primary_key=True),
    Column('number', Integer, primary_key=True),
    Column('bike_stands', Integer),
    Column('available_bike_stands', Integer),
    Column('available_bikes', Integer),
    Column('last_update', DateTime),
    Column('weather', String(30)),
    Column('temp', Float)
)

meta.create_all(conn)

NoneType = type(None)

# Catches null values and replaces these values with the current datetime


def get_station(obj):
    try:
        x = datetime.datetime.fromtimestamp(int(obj['last_update'] / 1e3))
    except:
        x = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    return {'number': obj['number'], 'bike_stands': obj['bike_stands'], 'available_bike_stands': obj['available_bike_stands'], 'available_bikes': obj['available_bikes'], 'last_update': x}


NAME = "Dublin"
STATIONS_URI = "https://api.jcdecaux.com/vls/v1/stations"
KEY = "53fa78aead76e2416050fc002610856adf0b2cee"

# Iterator used as index - can differentiate between insert blocks
iterator = 0
# JCDecaux API request
r = requests.get(STATIONS_URI, params={"apiKey": KEY, "contract": NAME})
JSON(r.json())

# Weather API data
weatherNAME = "7778677"
weatherKEY = "b5082b06a1653481cc7a8a9a533aafc3"
weatherUNITS = "metric"
weatherURI = "https://api.openweathermap.org/data/2.5/weather?id={}&appid={}&units={}".format(
    weatherNAME, weatherKEY, weatherUNITS)

# Infinitely loop
while True:
    try:
        # Weather API request
        r = requests.get(STATIONS_URI, params={
                         "apiKey": KEY, "contract": NAME})
        JSON(r.json())
        # Map station values
        values = list(map(get_station, r.json()))

        # Weather type and temperature data structuring
        w = requests.get(weatherURI)
        data = json.loads(w.text)
        weather = data["weather"][0]["main"]
        temp = data["main"]["temp"]
        JSON(w.json())
        for value in values:
            value['Insert_ID'] = iterator
            value['weather'] = weather
            value['temp'] = temp

        # Execute database call
        ins = dynamicData.insert().values(values)
        conn.execute(ins)
        # Wait 5 minutes
        time.sleep(5*60)

        # Add 1 to index
        iterator += 1
    except Exception as e:
        iterator += 1
        time.sleep(5*60)
