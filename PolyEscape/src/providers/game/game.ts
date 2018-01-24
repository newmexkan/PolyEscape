import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {PlatformHelper} from "../../models/platform-model";
import {Platform} from "ionic-angular";

/*
  Generated class for the GameProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GameProvider {

  url;
  platformHelper;

  constructor(public http: HttpClient,public plt: Platform) {

    this.platformHelper = new PlatformHelper(this.plt);

    this.url = this.platformHelper.getUrl();

  }

  getSkills(gameName) {
    return this.http.get(this.url +"/getSkills/"+gameName);
  }



}
