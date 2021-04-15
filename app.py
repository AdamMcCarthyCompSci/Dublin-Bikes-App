import datetime
from flask import Flask, render_template
from jinja2 import Template
from pandas.io.formats.format import Datetime64Formatter
from sqlalchemy import create_engine
import pandas as pd
from functools import lru_cache
import collections
import pickle


app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/hourlyOccupancy/<int:station_id>")
@lru_cache()
def get_hourlyOccupancy(station_id):
    print('calling stations')

    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=True)

    sql = f"""
        SELECT number, last_update, available_bike_stands, available_bikes FROM DublinBikesApp.dynamicData
        where number = {station_id}
    """
    df = pd.read_sql_query(sql, engine)
    df["last_update"] = pd.to_datetime(df["last_update"])
    df["day"] = df["last_update"].dt.dayofweek
    df["hour"] = df["last_update"].dt.hour
    res_df = pd.DataFrame(
        data={"hours": ["{}:00".format(x) for x in range(24)]})
    for i, days in enumerate(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']):
        day = []
        for hours in range(24):
            day.append(df.loc[(df["hour"] == hours) & (
                df["day"] == i)]['available_bike_stands'].mean())
        res_df[days] = day
    return res_df.to_json(orient='records')


@app.route("/dailyOccupancy/<int:station_id>")
@lru_cache()
def get_dailyOccupancy(station_id):
    print('calling stations')
    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=True)

    sql = f"""
        SELECT number, last_update, available_bike_stands, available_bikes FROM DublinBikesApp.dynamicData
        where number = {station_id}
    """
    df = pd.read_sql_query(sql, engine)
    df["last_update"] = pd.to_datetime(df["last_update"])

    df["last_update"] = pd.to_datetime(df["last_update"])
    res_df = df.groupby([df["last_update"].dt.dayofweek])[
        "available_bikes"].mean().reset_index()
    res_df["last_update"] = ["Monday", "Tuesday", "Wednesday",
                             "Thursday", "Friday", "Saturday", "Sunday"]
    return res_df.to_json(orient='records')


@app.route("/forecastOccupancy/<int:station_id>")
@lru_cache()
def get_forecastOccupancy(station_id):

    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=True)

    sql_station = f"""
        SELECT number,bike_stands FROM DublinBikesApp.stations
    where number = {station_id};
    """

    sql_prediction = f"""
    SELECT * from forecast;
    """

    sql_weather = f"""
    SELECT DISTINCT weather FROM DublinBikesApp.dynamicData
    where number = {station_id};
    """

    df_station = pd.read_sql_query(sql_station, engine)
    if df_station.shape[0] == 0:
        return ('Station number ' + str(station_id) + ' not found')
    else:
        print('station found')
        df_prediction = pd.read_sql_query(sql_prediction, engine)
        df_weather = pd.read_sql_query(sql_weather, engine)

    weather_events = df_weather['weather'].values.tolist()
    list_features = ['month', 'day', 'hour', 'temp']
    for event in weather_events:
        list_features.append('weather_'+event)

    df_prediction = df_prediction.assign(
        number=station_id, bike_stands=df_station.at[0, 'bike_stands'])
    df_prediction["day"] = df_prediction["last_update"].dt.dayofweek
    df_prediction["hour"] = df_prediction["last_update"].dt.hour
    df_prediction["month"] = df_prediction["last_update"].dt.month
    df_prediction = df_prediction.drop(["last_update"], axis=1)

    for col in ['month', 'day', 'hour', 'weather']:
        df_prediction[col] = df_prediction[col].astype("category")
    cat_attributes = ['weather']
    num_attributes = ['month', 'day', 'hour', 'temp']

    prediction_attributes = df_prediction[[
        'month', 'day', 'hour', 'weather', 'temp']]
    prediction_encoded_attributes = pd.get_dummies(
        prediction_attributes, columns=cat_attributes)

    list_prediction = list(prediction_encoded_attributes.columns)

    for feat in list_features:
        if feat not in list_prediction:
            prediction_encoded_attributes[feat] = 0

    # if collections.Counter(list_prediction) != collections.Counter(list_features):
     #   return ("Features are not aligned")

    model = "model_station_"+str(station_id)

    X_prediction = prediction_encoded_attributes
    with open(model, 'rb') as handle:
        model = pickle.load(handle)

    result = model.predict(X_prediction)

    df_forecast = pd.DataFrame()

    df_forecast['day'] = df_prediction['day']
    df_forecast['hour'] = df_prediction["hour"]
    df_forecast['available_bikes'] = pd.DataFrame(result).round(0).astype(int)
    if df_forecast['available_bikes'][0] > df_station['bike_stands'][0]:
        df_forecast['available_bikes'] = df_station['bike_stands']
    if df_forecast['available_bikes'][0] < 0:
        df_forecast['available_bikes'] = 0

    return df_forecast.to_json(orient='records')


@app.route("/stations")
@lru_cache()
def stations():
    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=True)
    dataFrame = pd.read_sql_table("stations", engine)
    return dataFrame.to_json(orient='records')


if __name__ == "__main__":
    app.run(debug=True)
