import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { ScenarioPage } from "../scenario/scenario";
import { InventairePage} from "../inventaire/inventaire";
import { EquipePage} from "../equipe/equipe";
import { MapPage} from "../map/map";
import {JoueurModel} from "../../models/joueur-model";
import {TimerComponent} from "../../components/timer/timer";

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
  mapPage = MapPage;
  scenarioPage = ScenarioPage;
  inventairePage = InventairePage;
  equipePage = EquipePage;

  //private players: Array<JoueurModel>;

  private game;
  private user;
  private time;

  @ViewChild(TimerComponent) timer: TimerComponent;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.game = navParams.get('game');
    this.user = navParams.get('user');
    this.time = this.game["scenario"]["timeInMinuts"]*60;

    console.log(this.game["chief"]);
    //this.players.push(new JoueurModel(this.game["chief"],1,true));

    //for(let i =2; i<this.game["players"];i++)
    //  this.players.push(new JoueurModel(this.game["players"][i]["name"],i,false));
  }



  ngOnInit() {
    setTimeout(() => {
      console.log("salut")
      this.timer.startTimer();
    }, 1000)
  }


}
