from flask import Flask, request, jsonify
import flask_cors
from datetime import datetime, timedelta
import db as dbm
import ai
import os

app = Flask(__name__)
flask_cors.CORS(app)


def getWeek(date):
    date = datetime.strptime(date, "%Y-%m-%d")
    
    sWeek = date - timedelta(days=date.weekday())
    eWeek = sWeek + timedelta(days=6)
    
    sWeekStr = sWeek.strftime("%Y-%m-%d")
    eWeekStr = eWeek.strftime("%Y-%m-%d")
    
    return sWeekStr, eWeekStr


@app.route('/statsWeek', methods=['GET'])
def getStatsWeek():
    params = request.args
    db = dbm.DB()
    
    if("data" not in params):
        data = db.getStatsWeek("1")
        return jsonify(data)
    
    data = db.getStatsWeek("1", data=params["data"])
    return jsonify(data)


@app.route('/statsAnno', methods=['GET'])
def getStatsAnno():
    params = request.args
    db = dbm.DB()
    
    if("data" not in params):
        data = db.getStatsAnno("1")
        return jsonify(data)
    
    data = db.getStatsAnno("1", data=params["data"])
    return jsonify(data)


@app.route('/statsMese', methods=['GET'])    
def getStatsMese():
    params = request.args
    db = dbm.DB()
    
    if("data" not in params):
        data = db.getStatsMese("1")
        return jsonify(data)
    
    data = db.getStatsMese("1", data=params["data"])
    return jsonify(data)


@app.route('/receipt', methods=['GET'])
def getReceipt():
    params = request.args
    if("id" not in params):
        return "No id provided", 400
    
    db = dbm.DB()
    data = db.getReceipt(params["id"])
    return jsonify(data)


@app.route('/addData', methods=['POST'])
def addReceipt():
    if('file' not in request.files):
        return {'status': 'no file'}
    
    image = request.files['file']
    perc = "/Users/giacomo/git/receiptStorer/imgSaved/" + image.filename.split(".")[0] + "_" + str(datetime.now().timestamp()) + ".png"
    
    os.makedirs(os.path.dirname(perc), exist_ok=True)
    image.save(perc)
    
    data = ai.getData(perc)
    
    db = dbm.DB()
    if("total" not in data or "date" not in data or "merchant_name" not in data):
        return {'status': 'error params finded'}, 401
    
    if(not db.addReceipt("1", perc, data["total"], data["date"], data["merchant_name"])):
        return {'status': 'error db'}, 401
    print("added: ", perc, data["total"], data["date"], data["merchant_name"])
    
    return jsonify(data)
    



if __name__ == '__main__':
    app.run()