from flask import Flask, render_template,jsonify,request
from jinja2 import Template
from sqlalchemy import create_engine

app = Flask(__name__)
app.debug = True

username = "DublinBikesApp"
password = "dublinbikesapp"
endpoint = "dublinbikesapp.cynvsd3ef0ri.us-east-1.rds.amazonaws.com"
port = "3306"
db = "DublinBikesApp"

@app.route('/', methods=['GET'])
def index():
    engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(username, password, endpoint, port, db), echo=True)
    output = engine.connect().execute("SELECT number,name FROM stations")
    stands = output.fetchall()
    return render_template("testdropdown.html",stands=stands)

if __name__ == "__main__":
    app.run()