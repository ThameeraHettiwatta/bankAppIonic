import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from '../../providers/global/global';
import { map } from 'rxjs/operators';
import { Http } from '@angular/http';
const myUrl = 'http://10.10.20.76:3000/transactions' 
/**
 * Generated class for the AgentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agent',
  templateUrl: 'agent.html',
})
export class AgentPage {
  agent_Id:string;
  password:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private databaseprovider: DatabaseProvider, public global: GlobalProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgentPage');
  }

  clearLogin(){
    this.agent_Id="";
    this.password="";
  }

  login(){
    let data=[];
    data.push({agent_id: this.agent_Id, password: this.password});
    console.log(data);
    this.http.post(myUrl, data).pipe(
      map(res => res.json())
  ).subscribe(response => {
    console.log(response);
    if(response.length>0){
      this.global.appAgentId=this.agent_Id;
      this.databaseprovider.updateAccounts(response);
      this.navCtrl.push(HomePage);
    }
  });
  //this.clearLogin();
  }
}
