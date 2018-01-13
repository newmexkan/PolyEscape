import { Component } from '@angular/core';
import {JoueurModel} from "../../models/joueur-model";
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
  joueurs: Array<JoueurModel>;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.joueurs =[];
    this.joueurs.push(new JoueurModel("poulet38",1,true));
    this.joueurs.push(new JoueurModel("cordonB",2,false));
    this.joueurs.push(new JoueurModel("Malcom",3,false));
    this.joueurs.push(new JoueurModel("PasDinspi",4,true));
  }


  startGame(){
    this.navCtrl.push(this.gamePage,{ 'joueurs': this.joueurs} );
  }


}
