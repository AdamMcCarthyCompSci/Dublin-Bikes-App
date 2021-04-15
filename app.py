from flask import Flask, render_template
from jinja2 import Template
from sqlalchemy import create_engine
import pandas as pd
from functools import lru_cache
import databaseInfo
import pickle

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
    sql = 'select dynamicData.Insert_ID, dynamicData.number, dynamicData.bike_stands, dynamicData.available_bike_stands, dynamicData.available_bikes, stations.number as "staticNumber", stations.name, stations.pos_lat, stations.pos_lng from dynamicData, stations where stations.number = dynamicData.number and Insert_ID = (SELECT MAX(Insert_ID) FROM DublinBikesApp.dynamicData) order by name asc;'
    # Query database and place in dataframe
    dataFrame = pd.read_sql_query(sql, engine)
    return dataFrame.to_json(orient='records')

@app.route("/forecastOccupancy/<int:station_id>")
@lru_cache()
def get_forecastOccupancy(station_id):
    # Connect to database
    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(
        databaseInfo.username, databaseInfo.password, databaseInfo.endpoint, databaseInfo.port, databaseInfo.db),
        echo=False)

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
        list_features.append('weather_' + event)

    df_prediction = df_prediction.assign(number=station_id, bike_stands=df_station.at[0, 'bike_stands'])
    df_prediction["day"] = df_prediction["last_update"].dt.dayofweek
    df_prediction["hour"] = df_prediction["last_update"].dt.hour
    df_prediction["month"] = df_prediction["last_update"].dt.month
    df_prediction = df_prediction.drop(["last_update"], axis=1)

    for col in ['month', 'day', 'hour', 'weather']:
        df_prediction[col] = df_prediction[col].astype("category")
    cat_attributes = ['weather']
    num_attributes = ['month', 'day', 'hour', 'temp']

    prediction_attributes = df_prediction[['month', 'day', 'hour', 'weather', 'temp']]
    prediction_encoded_attributes = pd.get_dummies(prediction_attributes, columns=cat_attributes)

    list_prediction = list(prediction_encoded_attributes.columns)

    for feat in list_features:
        if feat not in list_prediction:
            prediction_encoded_attributes[feat] = 0

    # if collections.Counter(list_prediction) != collections.Counter(list_features):
    #   return ("Features are not aligned")

    model = "models/model_station_" + str(station_id)

    X_prediction = prediction_encoded_attributes
    with open(model, 'rb') as handle:
        model = pickle.load(handle)

    result = model.predict(X_prediction)

    df_forecast = pd.DataFrame()

    df_forecast['day'] = df_prediction['day']
    df_forecast['hour'] = df_prediction["hour"]
    df_forecast['available_bikes_forecast'] = pd.DataFrame(result).round(0).astype(int)
    for i in range(df_forecast.shape[0]):
        if df_forecast.loc[i]['available_bikes_forecast'] > df_station.loc[0]['bike_stands']:
            df_forecast.loc[i]['available_bikes_forecast'] = df_station.loc[0]['bike_stands']
        elif df_forecast.loc[i]['available_bikes_forecast'] < 0:
            df_forecast.loc[i]['available_bikes_forecast'] = 0

    return df_forecast.to_json(orient='records')

# Run app
if __name__ == "__main__":
    app.run(debug=True)
