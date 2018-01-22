import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GameProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GameProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GameProvider Provider');
  }

  getSkills(gameName) {
    return this.http.get("http://" + "localhost" + ":8080/getSkills/"+gameName);
  }



}
