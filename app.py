from flask import Flask, render_template
from jinja2 import Template
from sqlalchemy import create_engine
import pandas as pd
from functools import lru_cache

app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/hourlyOccupancy/<int:station_id>")
@lru_cache()
def get_hourlyOccupancy(station_id):
    print('calling hourlyOccupancy')

    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=False)

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
    print('calling dailyOccupancy')

    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=False)

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


@app.route("/stations")
@lru_cache()
def stations():
    print('calling stations')
    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=False)

    sql = 'select dynamicData.Insert_ID, dynamicData.number, dynamicData.bike_stands, dynamicData.available_bike_stands, dynamicData.available_bikes, stations.number as "staticNumber", stations.name, stations.pos_lat, stations.pos_lng from dynamicData, stations where stations.number = dynamicData.number and Insert_ID = (SELECT MAX(Insert_ID) FROM DublinBikesApp.dynamicData);'
    dataFrame = pd.read_sql_query(sql, engine)
    return dataFrame.to_json(orient='records')


if __name__ == "__main__":
    app.run(debug=True)
