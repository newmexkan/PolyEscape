import {GamePage} from "../game/game";
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, ToastController, ModalController} from 'ionic-angular';
import {Socket} from 'ng-socket-io';
import {Observable} from "rxjs";
import {SelectScenarioPage} from "../select-scenario/select-scenario";
import {SkillModalPage} from "../skill-modal/skill-modal";

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
  nbUsers = 1;
  user;
  isChief: boolean;
  scenarioPicked: boolean = false;
  hasEnoughPlayers: boolean = false;

  @ViewChild('navbar') navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private socket: Socket, public modalCtrl: ModalController) {


    this.game = this.navParams.get('currentGame');
    this.user = this.navParams.get('currentUser');
    this.isChief = (this.user === this.game["chief"]);

    let existingUsers = this.game["players"];
    this.nbUsers = existingUsers.length;

    for (let i = 0; i < existingUsers.length; i++)
      if (existingUsers[i] !== this.user && existingUsers[i] !== this.game["chief"])
        this.users.push(existingUsers[i]);


    if(this.isChief) {
      this.getPickScenarioSignal().subscribe(data => {
        this.scenarioPicked = true;
        this.game = data["game"];
      });
    }


    this.getNewPlayers().subscribe(user => {
      this.users = [];
      this.nbUsers = user["players"].length;

      for (let i=0; i < user["players"].length; i++) {
        if (user["players"][i] !== this.user && user["players"][i] !== this.game["chief"]) {
          this.users.push(user["players"][i]);
        }
      }

      this.hasEnoughPlayers = (this.nbUsers === this.game["scenario"]["nbPlayers"]);
    });

    this.getStartSignal().subscribe(data => {
      this.navCtrl.push(this.gamePage, {'game': data["game"], 'user': this.user});
    });



  }

  notify(message) {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  startGame() {
    this.socket.emit('startGame', {game: this.game["name"], user: this.user});
  }

  getNewPlayers() {
    let observable = new Observable(observer => {
      this.socket.on('players_changed', (data) => {
        observer.next(data);
      });
    });
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

  openModal() {
    let myModal = this.modalCtrl.create(SkillModalPage, {gameName: this.game['name'], 'user': this.user});
    myModal.onDidDismiss(data => {
    });
    myModal.present();
  }

}
