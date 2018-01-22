import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Platform} from "ionic-angular";
import {platformBrowser} from "@angular/platform-browser";
import {PlatformHelper} from "../../models/platform-model";

/*
  Generated class for the IndicationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndicationsProvider {

  url;
  platformHelper;

  constructor(public http: HttpClient,public plt: Platform) {

    this.platformHelper = new PlatformHelper(this.plt);

    this.url = this.platformHelper.getUrl();


    console.log("platform : " +this.plt.platforms());
    console.log("url : " +this.url);
  }


  addIndications(gameName, indication) {
    return this.http.get(this.url+"/addIndication/"+gameName+"/"+indication);
  }

  getIndications(gameName) {
    return this.http.get(this.url+"/getIndications/"+gameName);
  }

  /*
  addIndications(gameName, indication) {
    return this.http.get("http://" + "localhost" + ":8080/addIndication/"+gameName+"/"+indication);
  }

  getIndications(gameName) {
    return this.http.get("http://" + "localhost" + ":8080/getIndications/"+gameName);
  }
*/
}
