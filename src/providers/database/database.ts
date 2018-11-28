import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { GlobalProvider } from '../../providers/global/global';



const myUrl = 'http://10.10.20.76:3000/transactions' 

//var agent_id = "1";

@Injectable()

export class DatabaseProvider {
  private pass: String;
  database: SQLiteObject;

  private databaseReady: BehaviorSubject<boolean>;
 
  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http, public global: GlobalProvider) {
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
 
  async insertTransaction(accountNo, type, amount) {
    let data = [accountNo, type, amount]
    try {
      const data_1 = await this.database.executeSql("INSERT INTO transction (account_no, credit, date_time, amount) VALUES (?, ?, datetime('now', 'localtime'), ?)", data);
      const data_2 = await this.database.executeSql("select count(*) as tCount from transction", []).catch(e => console.error(e));
      if(data_2.rows.item(0).tCount>=100){
        this.getTransactions();
      }
      return data_1;
    }
    catch (err) {
      console.log('Error: ', err);
      return err;
    }
  }
 
  async updateBalance(accountNo, balance) {
    console.log(accountNo,balance);
    try {
      const data = await this.database.executeSql("UPDATE account SET balance = ? WHERE account_no = ?", [balance, accountNo]);
      console.log("updated");
      return data;
    }
    catch (err) {
      console.log('Error: ', err);
      return err;
    }
  }
 
  async getAccount(accountNo){
    try {
      const data = await this.database.executeSql("SELECT * FROM account WHERE account_no=?", [parseInt(accountNo)]);
      let developers = [];
      developers.push({ type_id: data.rows.item(0).type_id, account_no: data.rows.item(0).account_no, balance: data.rows.item(0).balance, opening_date: data.rows.item(0).opening_date, agent_id: data.rows.item(0).agent_id, password: data.rows.item(0).password });
      return developers;
    }
    catch (err) {
      console.log('Error: ', err);
      return [];
    }
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  async getAllTransactions(){

      try {
      const data = await this.database.executeSql("SELECT * FROM transction", []);
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          developers.push({ transaction_id: data.rows.item(i).transaction_id, account_no: data.rows.item(i).account_no, credit: data.rows.item(i).credit, amount: data.rows.item(i).amount, agent_Id: this.global.appAgentId });
        }
      }
      
      return developers;
    }
    catch (err) {
      console.log('Error: ', err);
      return [];
    }
    
  }

  async checkMinBalance(type_id){
    try {
      const data = await this.database.executeSql("select minimum_balance from account_type_info where type_id=?", [type_id]);
      let developers = [];
      developers.push({ minBalance: data.rows.item(0).minimum_balance });
      return developers;
    }
    catch (err) {
      console.log('Error: ', err);
      return [];
    } 
  }

  deleteTransactions(){
    this.database.executeSql("DELETE FROM transction", []).then(data => {
      }, err => {
        console.log('Error: ', err);
        //return [];
      }); 
  }



  updateAccounts(resp){
    for (var i=0; i<resp.length; i++){
        this.database.executeSql("INSERT OR IGNORE INTO account(type_id, account_no, balance, opening_date, agent_id, password) VALUES(?,?,?,?,?,?)",[resp[i].type_id, parseInt(resp[i].account_no), parseInt(resp[i].balance), resp[i].opening_date, resp[i].agent_id, resp[i].password]).catch(e => console.error(e));
        this.updateBalance(resp[i].account_no, resp[i].balance);
    }
  }


  getTransactions() {

    this.getAllTransactions().then(data => {
      //this.developers = data;
   // console.log(data);
    if(data.length>0){
    this.http.post(myUrl, data).pipe(
        map(res => res.json())
    ).subscribe(response => {
      if(response.length>0){
      this.updateAccounts(response);
      this.deleteTransactions();
      //this.deleteTransactions();
        //console.log('POST Response:', response);
      }
      
    });
  }

  })

     /* this.http.get('http://192.168.8.101:3000/transactions/login?username=agent&password=agentpassword').pipe(
        map(res => res.json())
    ).subscribe(response => {
        console.log('GET Response:', response);
    });  */

  }

 
}



