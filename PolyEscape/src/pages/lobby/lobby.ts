import {GamePage} from "../game/game";
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Navbar, AlertController, ToastController} from 'ionic-angular';
import {Http} from "@angular/http";
import {Socket} from 'ng-socket-io';
import {Observable} from "rxjs";
import {SelectScenarioPage} from "../select-scenario/select-scenario";

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

  selectScenario = SelectScenarioPage;
  gamePage = GamePage;
  game = {};
  users = [];
  user;
  isChief: boolean;
  scenarioPicked: boolean = false;
  hasEnoughPlayers: boolean = false;
  selected_scenario = {};

  @ViewChild('navbar') navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public toastCtrl: ToastController, private socket: Socket, private platform: Platform, public alertCtrl: AlertController) {


    this.game = this.navParams.get('currentGame');
    this.user = this.navParams.get('currentUser');
    this.isChief = (this.user === this.game["chief"]);


    var existingUsers = this.game["players"];
    for (var i = 0; i < existingUsers.length; i++)
      if (existingUsers[i] !== this.user && existingUsers[i] !== this.game["chief"])
        this.users.push(existingUsers[i]);


    this.getNewPlayers().subscribe(user => {
      this.users = [];

      for (var i = 0; i < user["players"].length; i++) {
        if (user["players"][i] !== this.user) {
          this.users.push(user["players"][i]);
        }
      }

      this.hasEnoughPlayers = (this.users.length + 1 === this.game["scenario"]["nbPlayers"]);

    });

    this.getStartSignal().subscribe(data => {
      this.navCtrl.push(this.gamePage, {'game': data["game"], 'user': this.user});
    });

    this.getPickScenarioSignal().subscribe(data => {
      this.scenarioPicked = true;
      this.selected_scenario = data['scenario']
      let toast = this.toastCtrl.create({
        message: "Le scenario n°" + data['id'] + " a été choisi",
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  startGame() {
    this.socket.emit('startGame', {game: this.game["name"], user: this.user});
  }

  getNewPlayers() {
    let observable = new Observable(observer => {
      this.socket.on('players_changed', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getStartSignal() {
    let observable = new Observable(observer => {
      this.socket.on('game_start', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getPickScenarioSignal() {
    let observable = new Observable(observer => {
      this.socket.on('scenario_pick', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }


  quitCurrentGame() {
    this.socket.emit('quitGame', {game: this.game["name"], user: this.user});
    this.navCtrl.push('home');
  }


  pickScenario() {
    this.navCtrl.push(this.selectScenario, {
      gameName: this.game['name'],
    });
  }

}
