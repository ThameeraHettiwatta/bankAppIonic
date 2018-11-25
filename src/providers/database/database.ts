import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
 

var agent_id = "1";

@Injectable()

export class DatabaseProvider {
  
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
 
  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      //change*
      
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_flled').then(val => {
            console.log("database filled",val);
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          })
          .catch(err => {
            this.fillDatabase();
          });
        });
      
    });
  }
 
  fillDatabase() {
    this.http.get('assets/project.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_flled', true);
          })
          .catch(e => console.error(e));
      });
  }
 
  addDeveloper(accountNo, type, amount) {
    let data = [accountNo, type, amount]
    return this.database.executeSql("INSERT INTO transction (account_no, credit, date_time, amount) VALUES (?, ?, datetime('now', 'localtime'), ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }
 
  depositAmount(accountNo, balance) {
    console.log(accountNo,balance);
    return this.database.executeSql("UPDATE account SET balance = ? WHERE account_no = ?", [ balance, accountNo ]).then(data => {
      console.log("updated");
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  /*getAllDevelopers() {
    return this.database.executeSql("SELECT * FROM developer", []).then((data) => {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          developers.push({ name: data.rows.item(i).name, skill: data.rows.item(i).skill, yearsOfExperience: data.rows.item(i).yearsOfExperience });
        }
      }
      return developers;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }*/
 
  getAccount(accountNo){
    return this.database.executeSql("SELECT * FROM account WHERE account_no=?", [parseInt(accountNo)]).then((data) => {
      let developers = [];
      developers.push({ type_id: data.rows.item(0).type_id, account_no: data.rows.item(0).account_no, balance: data.rows.item(0).balance, opening_date: data.rows.item(0).opening_date, agent_id: data.rows.item(0).agent_id, password: data.rows.item(0).password});  
      return developers;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  getAllTransactions(){

      return this.database.executeSql("SELECT * FROM transction", []).then((data) => {
        let developers = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            developers.push({ transaction_id: data.rows.item(i).transaction_id, account_no: data.rows.item(i).account_no, credit: data.rows.item(i).credit, amount: data.rows.item(i).amount, agent_Id: agent_id });
          }
        }
        return developers;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
    
  }
 
}