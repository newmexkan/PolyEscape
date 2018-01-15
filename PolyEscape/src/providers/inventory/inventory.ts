import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the InventoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InventoryProvider {

  constructor(public http: HttpClient) {
    console.log('Hello InventoryProvider Provider');
  }

  addItem(game, code) {
    console.log("getAllScenarios() = ");
    // console.log(this.http.get("http://localhost:8080/addItem/"+ game + '/' + code)["inventory"]);
    return this.http.get("http://" + "localhost" + ":8080/addItem/"+game+"/"+code);
  }

}
