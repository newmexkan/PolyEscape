import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GamePage } from "../game/game";

/**
 * Generated class for the LobbyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html',
})
export class LobbyPage {

  gamePage = GamePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  startGame(){
    this.navCtrl.push(this.gamePage);

  }


}
