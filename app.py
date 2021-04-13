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
    username = "DublinBikesApp"
    password = "dublinbikesapp"
    endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
    port = "3306"
    db = "DublinBikesApp"

    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        username, password, endpoint, port, db), echo=True)

    sql = f'''
        select WEEKDAY(last_update) as "weekday", HOUR(last_update) as "hour", AVG(available_bikes) "average_bikes"
        from dynamicData
        where number = {station_id}
        group by (select(WEEKDAY(last_update))), (select(HOUR(last_update)));
    '''

    df = pd.read_sql_query(sql, engine)
    df.sort_values(['weekday', 'hour'], ignore_index=True, inplace=True)

    res_df = pd.DataFrame(
        data={"hours": ["{}:00".format(x) for x in range(24)]})
    for i, days in enumerate(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']):
        day = []
        for hours in range(24):
            day.append(float(df.loc[(df["hour"] == hours) & (df["weekday"] == i)]['average_bikes']))
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
        select WEEKDAY(last_update) as "weekday", AVG(available_bikes) "available_bikes"
        FROM DublinBikesApp.dynamicData
        where number = {station_id}
        group by (select(WEEKDAY(last_update)));
    """
    df = pd.read_sql_query(sql, engine)
    res_df = df

    res_df["weekday"] = ["Monday", "Tuesday", "Wednesday",
                         "Thursday", "Friday", "Saturday", "Sunday"]

    res_df.rename(columns={"weekday": "last_update"}, inplace=True)
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
