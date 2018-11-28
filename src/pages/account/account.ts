import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { IonicPage, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { GlobalProvider } from '../../providers/global/global';
import { map } from 'rxjs/operators';
const myUrl = 'http://10.10.20.76:3000/transactions/special'



/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  developer = {amount:"",credit:''};
  developers = [];
  account_no: string;
  constructor(public navCtrl: NavController, private navParams: NavParams, public databaseprovider: DatabaseProvider, private platform: Platform, private http: Http, public global: GlobalProvider) {
    this.account_no = navParams.get('accountNo');
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log("subscribed, loded");
        this.getAccountInfo();
      }
    })
    setInterval(() => { 
      console.log('gguj');
      this.databaseprovider.getTransactions(); // Now the "this" still references the component
    }, 10000);
  }
 

  clearPage(){
    this.developer.amount="";
    this.developer.credit="";
  }

   getAccountInfo() {
    this.databaseprovider.getAccount(this.account_no).then(data => {
      console.log("sud");
      this.developers = data;
    })
  } 

  updateTransaction(accountNo, credit, amount){
    this.databaseprovider.insertTransaction(parseInt(accountNo), parseInt(credit), parseInt(amount))
    .then(data => {
      this.getAccountInfo();
      this.clearPage();
    }).catch(e => console.error(e));
  }

  doDeposite(){
    var newBalance =((parseInt(this.developers[0].balance)) + (parseInt(this.developer['amount'])));
    this.databaseprovider.updateBalance(parseInt(this.account_no),newBalance).then(data=>{});
    this.updateTransaction(this.account_no, this.developer['credit'], this.developer['amount']);
    alert("Transaction successful");
    
  }

  doWithdraw(){
    var newBalance =((parseInt(this.developers[0].balance))-(parseInt(this.developer['amount'])));
    var miniBalance=0;
      this.databaseprovider.checkMinBalance(this.developers[0].type_id).then(data=>{
        miniBalance = parseInt(data[0].minBalance);
      console.log(miniBalance);
        if(newBalance>0 && (newBalance>miniBalance)){
          this.databaseprovider.updateBalance(parseInt(this.account_no), newBalance).then(data=>{});
          this.updateTransaction(this.account_no, this.developer['credit'], this.developer['amount']);
          alert("Transaction successful");
        }
        else{
          alert("Cannot withdraw, insufficient balance");
        }
      });
      
}
 
  doTransaction() {
      if(this.developer['credit']=="0"){
       this.doDeposite();
      }
      else if(this.developer['credit']=="1"){
        if(this.global.agent){
          this.doWithdraw();
        }
        else{
          let data=[];
          data.push({ account_no: this.account_no ,amount: this.developer['amount'], agent_id: this.developers[0].agent_id });
          console.log(data);
          if(data.length>0){
            this.http.post(myUrl, data).pipe(
              map(res => res.json())
            ).subscribe(response => {
              console.log('POST Response:', response);
              if(response[1].cash_error==false){
              this.databaseprovider.updateBalance(parseInt(response[0].account_no), parseInt(response[0].balance)).then(data=>{});
              this.getAccountInfo();
              alert("Transaction successful");
              }
              else{
                alert("Cannot withdraw, insufficient balance");
              }
              this.clearPage();
             // console.log('POST Response:', response);
          });
          }

          console.log('send post request');
        }
        
      }
      else{
        alert("Fill the form correctly");
      }
      
   
   // console.log("clicked")
  }


}


