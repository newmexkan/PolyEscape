import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the GamePage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  scenarioRoot = 'ScenarioPage'
  inventaireRoot = 'InventairePage'
  equipeRoot = 'EquipePage'


  constructor(public navCtrl: NavController) {}

}
