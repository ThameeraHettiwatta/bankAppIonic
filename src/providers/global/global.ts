import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  public agent: boolean;
  public appAgentId: string;
  constructor() {
    this.appAgentId='agent1';
    this.agent=false;
    console.log('Hello GlobalProvider Provider');
  }

}
