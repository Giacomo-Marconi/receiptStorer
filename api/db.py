import mysql.connector
from datetime import datetime, timedelta
import json

rs = {}

with open("./settings.json", "r") as f:
    rs = json.load(f)

if("host" not in rs or "username" not in rs or "password" not in rs or "database" not in rs):
    print("Errore nel caricamento del file settings.json")
    exit(0)

def checkData(date):
    try:
        datetime.strptime(date, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def getWeek(date):
    date = datetime.strptime(date, "%Y-%m-%d")
    
    sWeek = date - timedelta(days=date.weekday())
    eWeek = sWeek + timedelta(days=6)
    
    sWeekStr = sWeek.strftime("%Y-%m-%d")
    eWeekStr = eWeek.strftime("%Y-%m-%d")
    
    return sWeekStr, eWeekStr


class DB:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host=rs['host'],
            user=rs['username'],
            password=rs['password'],
            database=rs['database']
        )
        self.cursor = self.connection.cursor(dictionary=True)
    
    def close(self):
        self.cursor.close()
        self.connection.close()

    def getReceipt(self, id):
        q = """
        select * from receipt where idU = %s
        """
        
        self.cursor.execute(q, (id,))
        result = self.cursor.fetchall()
        self.close()
        return result
    
    def addReceipt(self, idU, path, totale, data, negozio):
        q = """
        insert into receipt(path, totale, data, negozio, idU) values(%s, %s, %s, %s, %s)
        """
        
        try:
            self.cursor.execute(q, (path, totale, data, negozio, idU))
            self.connection.commit()
            self.close()
            return True
        except Exception as e:
            print(f"Errore durante l'inserimento della ricevuta: {e}")
            self.close()
            return False
    
    def getStatsAnno(self, idU, data="2025-01-01"):
        q = """
        select * from receipt where year(data) = %s and idU = %s
        """
        anno = data.split("-")[0]
        self.cursor.execute(q, (anno, idU))
        result = self.cursor.fetchall()
        self.close()
        return result
    
    def getStatsMese(self, idU, data="2025-01-01"):
        q = """
        select * from receipt where month(data) = %s and year(data) = %s and idU = %s
        """
        
        mese = data.split("-")[1]
        anno = data.split("-")[0]
        
        self.cursor.execute(q, (mese, anno, idU))
        result = self.cursor.fetchall()
        self.close()
        return result

    def getStatsWeek(self, idU, data="0"):
        if data == "0" or not checkData(data):
            sWeek, eWeek = getWeek(str(datetime.now().date()))
        else:
            sWeek, eWeek = getWeek(data)
        
        q = """
        select * from receipt where data between %s and %s and idU = %s
        """
        
        self.cursor.execute(q, (sWeek, eWeek, idU))
        result = self.cursor.fetchall()
        self.close()
        return result




def main():
   '''''' 






if __name__ == "__main__":
    main()
    
    
    
"""
create table user(
    id int primary key auto_increment,
    username varchar(255) not null unique,
    password varchar(255) not null
)

create table receipt(
    id int primary key auto_increment,
    path varchar(255) not null unique,
    totale float not null,
    data date not null,
    negozio varchar(255) not null,
    idU int not null,
    foreign key(idU) references user(id)
)
"""
