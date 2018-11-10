import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { IonicPage, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

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
  constructor(public navCtrl: NavController, private navParams: NavParams, private databaseprovider: DatabaseProvider, private platform: Platform) {
    this.account_no = navParams.get('accountNo');
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log("subscribed, loded");
        this.loadDeveloperData();
      }
    })
  }
 
   loadDeveloperData() {
    this.databaseprovider.getAccount(this.account_no).then(data => {
      console.log("sud");
      this.developers = data;
    })
  } 

  updateTransaction(){
    this.databaseprovider.addDeveloper(parseInt(this.account_no), parseInt(this.developer['credit']), parseInt(this.developer['amount']))
    .then(data => {
      this.loadDeveloperData();
    }).catch(e => console.error(e));
  }
 
  addDeveloper() {
      if(this.developer['credit']=="0"){
        var newBalance =((parseInt(this.developers[0].balance)) + (parseInt(this.developer['amount'])));

        this.databaseprovider.depositAmount(parseInt(this.account_no),newBalance).then(data=>{});
        this.updateTransaction();
     }
     
      else if(this.developer['credit']=="1"){
        var newBalance =((parseInt(this.developers[0].balance))-(parseInt(this.developer['amount'])));
        if(newBalance>0){
          this.databaseprovider.depositAmount(parseInt(this.account_no), newBalance).then(data=>{});
          this.updateTransaction();
        }
        else{
          alert("Cannot withdraw, insufficient balance");
        }
      }
      
      else{
        alert("Fill the form correctly");
      }
      
   
   // console.log("clicked")
  }
 
}




