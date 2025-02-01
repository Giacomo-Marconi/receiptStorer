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
    
    if("data" not in params):
        db = dbm.DB()
        data = db.getReceipt(params["id"])
        return jsonify(data)
    
    db = dbm.DB()
    data = db.getReceiptMese(params["id"], data=params["data"])
    return jsonify(data)

@app.route('/lastReceipt', methods=['GET'])
def getLastReceipt():
    params = request.args
    if("id" not in params):
        return "No id provided", 400
    
    db = dbm.DB()
    data = db.getLastReceipt(params["id"])
    return jsonify(data)


@app.route('/analize', methods=['POST'])
def analize():
    print(request.files)
    if('file' not in request.files):
        print("no file")
        return {'error': 'no file'}, 401
    
    try:
        image = request.files['file']
        perc = "/Users/giacomo/git/receiptStorer/imgSaved/" + image.filename.split(".")[0] + "_" + str(datetime.now().timestamp()) + ".png"
        
        os.makedirs(os.path.dirname(perc), exist_ok=True)
        print("ok")
        image.save(perc)
        print("saved: ", perc)
        data = ai.getData(perc)
        data['perc'] = perc
        print(data)
        return jsonify(data)
    except Exception as e:
        print(e)
        return {'error': e}, 401


@app.route('/addData', methods=['POST'])
def addReceipt():
    print(request.json)
    data = request.json
    print("\n\ndata:\n",data)
    if("perc" not in data or "totale" not in data or "data" not in data or "negozio" not in data):
        return {'error': 'error params finded'}, 401
    
    db = dbm.DB()
    
    if(not db.addReceipt("1", data["perc"], data["totale"], data["data"], data["negozio"])):
        return {'error': 'error db'}, 401
    print("added: ", data['perc'], data["totale"], data["data"], data["negozio"])
    
    return {'status': 'ok'}
    



if __name__ == '__main__':
    app.run(port="20002")

