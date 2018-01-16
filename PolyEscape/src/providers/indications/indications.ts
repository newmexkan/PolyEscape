import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the IndicationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndicationsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello IndicationsProvider Provider');
  }

  addIndications(gameName, indication) {
    return this.http.get("http://" + "localhost" + ":8080/addIndication/"+gameName+"/"+indication);
  }

  getIndications(gameName) {
    return this.http.get("http://" + "localhost" + ":8080/getIndications/"+gameName);
  }

}
