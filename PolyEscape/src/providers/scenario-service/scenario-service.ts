import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ScenarioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ScenarioServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ScenarioServiceProvider Provider');
  }

  getAllScenarios() {
    console.log(this.http.get("getAllScenarios() = " + "http://localhost:8080/getAllScenarios/"));
    return this.http.get("http://" + "localhost" + ":8080/getAllScenarios/");
  }



}
