import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {PlatformHelper} from "../../models/platform-model";

/*
  Generated class for the ScenarioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ScenarioServiceProvider {

  url;
  platformHelper;

  constructor(public http: HttpClient, public plt: Platform) {

    this.platformHelper = new PlatformHelper(this.plt);

    this.url = this.platformHelper.getUrl();


    console.log("platform : " + this.plt.platforms());
    console.log("url : " + this.url);
  }

  getAllScenarios()
  {
    //console.log(this.http.get("getAllScenarios() = " + "http://localhost:8080/getAllScenarios/"));
    return this.http.get(this.url+"/getAllScenarios/");
  }

  /*

getAllScenarios()
{
  console.log(this.http.get("getAllScenarios() = " + "http://localhost:8080/getAllScenarios/"));
  return this.http.get("http://" + "localhost" + ":8080/getAllScenarios/");
}
*/


}
