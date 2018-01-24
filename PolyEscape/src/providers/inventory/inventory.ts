import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Platform} from "ionic-angular";
import {PlatformHelper} from "../../models/platform-model";

/*
  Generated class for the InventoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InventoryProvider {


  url;
  platformHelper;

  constructor(public http: HttpClient, public plt: Platform) {

    this.platformHelper = new PlatformHelper(this.plt);

    this.url = this.platformHelper.getUrl();

  }

  addItem(game, code) {
    return this.http.get(this.url+"/addItem/" + game + "/" + code);
  }

  getInventory(game) {
    return this.http.get(this.url+"/getInventory/" + game);
  }
}

