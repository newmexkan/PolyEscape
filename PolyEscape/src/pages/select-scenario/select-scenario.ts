import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ScenarioServiceProvider} from "../../providers/scenario-service/scenario-service";
import {LobbyPage} from "../lobby/lobby";
import {Socket} from "ng-socket-io";

/**
 * Generated class for the SelectScenarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-scenario',
  templateUrl: 'select-scenario.html',
  providers: [ScenarioServiceProvider],
})
export class SelectScenarioPage {

  list: any;
  gameName: any;

  listeScenarios: Array<{
    id: number,
    name: string,
    nbPlayers: number,
    timeInMinuts: number,
    summary: string,
    missions: Array<{ message: string, item: number }>
  }>;

  lobbyPage = LobbyPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private scenarioService: ScenarioServiceProvider, private alertCtrl: AlertController) {
    this.listeScenarios = [];
    this.gameName = navParams.get('gameName');
    this.create();
  }

  create() {
    this.scenarioService.getAllScenarios().subscribe(res => {

      console.log("In Create");
      var keys = Object.keys(res['scenarios']);
      for (var i = 0; i < keys.length; ++i) {
        var missions: any;
        missions = [];

        for (var j in res['scenarios'][keys[i]].missions) {
          missions.push({
            message: res['scenarios'][keys[i]].missions[j].message,
            item: res['scenarios'][keys[i]].missions[j].item
          });
        }
        // console.log(missions);
        var elmt = {
          id: res['scenarios'][i].id,
          name: res['scenarios'][i].name,
          nbPlayers: res['scenarios'][i].nbPlayers,
          timeInMinuts: res['scenarios'][i].timeInMinuts,
          summary: res['scenarios'][i].summary,
          missions: missions
        };
        this.listeScenarios.push(elmt);
      }

    });
  }

  select(salut) {
    let scenar = this.listeScenarios.find(i => i.id === salut);
    let alert = this.alertCtrl.create({
      title: 'Choisir ce scénario ?',
      message: 'Vous devrez terminer cette mission en moins de ' + scenar['timeInMinuts'] + '  minutes',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sélectionner',
          handler: () => {
            console.log("id choisi : "+salut)
            this.socket.emit('pickScenario', {game: this.gameName, id:salut});
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }


}
