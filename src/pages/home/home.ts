import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AccountPage } from '../account/account';
import { IonicPage, NavParams } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from '../../providers/global/global';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  accNo:string;
  password:string;
  developers = [];
  pass:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, public global: GlobalProvider) {

  }

  clearLogin(){
    this.accNo="";
    this.password="";
  }

  login(){
   this.databaseprovider.getAccount(this.accNo).then(data => {
    //alert("6528657");
    console.log(Md5.hashStr(this.password));
    if(data.length!=0){
    this.developers = data;
    if(this.developers[0].password==Md5.hashStr(this.password)){
      if(this.developers[0].agent_id==this.global.appAgentId){
        this.global.agent=true;
        console.log('same agent');
      }
      this.navCtrl.push(AccountPage, {
        accountNo: this.accNo
      });
      this.clearLogin();
    }
    else{
      alert("Invalid password");
      this.clearLogin();
    }
  
}
  else{
    alert("Invalid account");
  }
  }, err => {
    console.log('Error: ', err);
  });
   
  }
/* 
  getAccountNo(){
    this.databaseprovider.getAccount(this.accNo).then(data => {
      this.developers = data;
    }) 

    return this.accNo;  //this.developers[0].account_no;
  }
*/

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}