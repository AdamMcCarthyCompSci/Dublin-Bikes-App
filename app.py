from flask import Flask, render_template
from jinja2 import Template
from sqlalchemy import create_engine
import pandas as pd
from functools import lru_cache

app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/about")
def about():
    return app.send_static_file("about.html")


@app.route("/contact")
def contact():
    d = {'name': 'Adam'}
    # tpl = Template()
    # return render_template("contact.html", name="Adam")
    return render_template("contact.html", **d)


@app.route("/occupancy/<int:station_id>")
@lru_cache()
def get_occupancy(station_id):
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
