import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AccountPage } from '../account/account';
import { IonicPage, NavParams } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  accNo:string;
  password:string;
  developers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider) {

  }

  login(){
   
   this.databaseprovider.getAccount(this.accNo).then(data => {
    //alert("6528657");
    this.developers = data;
    if(this.developers[0].password==this.password){
      this.navCtrl.push(AccountPage, {
        accountNo: this.accNo
      });
    }
  })

  }

  getAccountNo(){
   /*  this.databaseprovider.getAccount(this.accNo).then(data => {
      this.developers = data;
    }) */

    return this.accNo;  //this.developers[0].account_no;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
