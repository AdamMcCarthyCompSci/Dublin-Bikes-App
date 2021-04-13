from flask import Flask, render_template
from jinja2 import Template
from sqlalchemy import create_engine
import pandas as pd
from functools import lru_cache
import databaseInfo

app = Flask(__name__)

# Renders main app page


@app.route("/")
def hello():
    return render_template("index.html")

# Gets average hourly data from database


@app.route("/hourlyOccupancy/<int:station_id>")
@lru_cache()
def get_hourlyOccupancy(station_id):

    # Connect to database
    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        databaseInfo.username, databaseInfo.password, databaseInfo.endpoint, databaseInfo.port, databaseInfo.db), echo=False)

    # SQL query to get average hourly data per week
    sql = f'''
        select WEEKDAY(last_update) as "weekday", HOUR(last_update) as "hour", AVG(available_bikes) "average_bikes"
        from dynamicData
        where number = {station_id}
        group by (select(WEEKDAY(last_update))), (select(HOUR(last_update)));
    '''

    # Get dataframe from query
    df = pd.read_sql_query(sql, engine)

    # Manipulate dataframe into one that can be used with a Google Charts line plot
    df.sort_values(['weekday', 'hour'], ignore_index=True, inplace=True)

    res_df = pd.DataFrame(
        data={"hours": ["{}:00".format(x) for x in range(24)]})
    for i, days in enumerate(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']):
        day = []
        for hours in range(24):
            day.append(float(df.loc[(df["hour"] == hours) & (
                df["weekday"] == i)]['average_bikes']))
        res_df[days] = day
    return res_df.to_json(orient='records')

# Get daily averages from database


@app.route("/dailyOccupancy/<int:station_id>")
@lru_cache()
def get_dailyOccupancy(station_id):
    print('calling dailyOccupancy')

    # Connect to database
    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        databaseInfo.username, databaseInfo.password, databaseInfo.endpoint, databaseInfo.port, databaseInfo.db), echo=False)

    # Get SQL query for daily averages
    sql = f"""
        select WEEKDAY(last_update) as "weekday", AVG(available_bikes) "available_bikes"
        FROM DublinBikesApp.dynamicData
        where number = {station_id}
        group by (select(WEEKDAY(last_update)));
    """

    # Query database and place in dataframe
    df = pd.read_sql_query(sql, engine)

    # Format dataframe for use with Google Charts
    res_df = df

    res_df["weekday"] = ["Monday", "Tuesday", "Wednesday",
                         "Thursday", "Friday", "Saturday", "Sunday"]

    res_df.rename(columns={"weekday": "last_update"}, inplace=True)
    return res_df.to_json(orient='records')

# Get static stations data along with most recent update data


@app.route("/stations")
@lru_cache()
def stations():
    print('calling stations')

    # Connect to database
    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        databaseInfo.username, databaseInfo.password, databaseInfo.endpoint, databaseInfo.port, databaseInfo.db), echo=False)

    # SQL query to get combination of static and dynamic data for stations
    sql = 'select dynamicData.Insert_ID, dynamicData.number, dynamicData.bike_stands, dynamicData.available_bike_stands, dynamicData.available_bikes, stations.number as "staticNumber", stations.name, stations.pos_lat, stations.pos_lng from dynamicData, stations where stations.number = dynamicData.number and Insert_ID = (SELECT MAX(Insert_ID) FROM DublinBikesApp.dynamicData);'
    # Query database and place in dataframe
    dataFrame = pd.read_sql_query(sql, engine)
    return dataFrame.to_json(orient='records')


# Run app
if __name__ == "__main__":
    app.run(debug=True)
