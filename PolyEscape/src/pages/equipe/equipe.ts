import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {JoueurModel} from "../../models/joueur-model";

/**
 * Generated class for the EquipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {

  joueurs: Array<JoueurModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.joueurs = navParams.get('joueurs');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipePage');
  }

}
