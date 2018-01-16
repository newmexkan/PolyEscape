import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { ScenarioPage } from "../scenario/scenario";
import { InventairePage} from "../inventaire/inventaire";
import { EquipePage} from "../equipe/equipe";
import { MapPage} from "../map/map";
import {TimerComponent} from "../../components/timer/timer";
import { Socket } from 'ng-socket-io';
import {Observable} from "rxjs";

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

  private players = [];

  game;
  user;
  time;

  @ViewChild(TimerComponent) timer: TimerComponent;


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private socket: Socket) {
    this.game = navParams.get('game');
    this.user = navParams.get('user');
    this.time = this.game["scenario"]["timeInMinuts"]*60;
    this.players.push(this.game["chief"]);

    for(let i =0; i<this.game["players"];i++)
      this.players.push(this.game["players"][i]);

    this.getNotifications().subscribe(data => {
      this.notify(data["message"]);
      this.game = data["game"];
    });
  }



  ngOnInit() {
    setTimeout(() => {
      this.timer.startTimer();
    }, 1000)
  }

  getNotifications(){
    let observable = new Observable(observer => {
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  notify(message) {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }




}
