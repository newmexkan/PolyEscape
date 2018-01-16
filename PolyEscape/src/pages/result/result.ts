import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  private result;
  private nav;
  mapPage = HomePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.nav = navCtrl;
    this.result = this.navParams.get('win')?"Bravo !":"Dommage !";
  }

  returnHome(){
    this.nav.push(HomePage);
  }

}
