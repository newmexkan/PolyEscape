import {JoueurModel} from "../../models/joueur-model";
import { GamePage } from "../game/game";
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Navbar, AlertController} from 'ionic-angular';
import {Http} from "@angular/http";
import { Socket } from 'ng-socket-io';
import {Observable} from "rxjs";

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
  game = {};
  users = [];
  user;
  isChief: boolean;
  hasEnoughPlayers : boolean = false;

  @ViewChild('navbar') navBar: Navbar;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private socket: Socket,private platform: Platform,public alertCtrl: AlertController) {


    this.game = this.navParams.get('currentGame');
    this.user = this.navParams.get('currentUser');
    this.isChief = (this.user === this.game["chief"]);


    var existingUsers = this.game["players"];
    for (var i = 0; i < existingUsers.length; i++)
        this.users.push(existingUsers[i]);


    this.getNewPlayers().subscribe(user => {
      this.users = [];

      for (var i = 0; i < user["players"].length; i++) {
        if (user["players"][i] !== this.user) {
          this.users.push(user["players"][i]);
        }
      }
      this.hasEnoughPlayers = (this.users.length+1 === this.game["scenario"]["nbPlayers"]);

    });

    this.getStartSignal().subscribe(data => {
      this.navCtrl.push(this.gamePage,{ 'game': data.game, 'user': this.user});
    });

  }


  startGame(){
    this.socket.emit('startGame', {game:this.game["name"], user:this.user});
  }

  getNewPlayers(){
    let observable = new Observable(observer => {
      this.socket.on('players_changed', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getStartSignal(){
    let observable = new Observable(observer => {
      this.socket.on('game_start', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }


  selectScenario() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choisissez un scénario :');

    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);

      }
    });
    alert.present();
  }


  quitCurrentGame(){
    this.socket.emit('quitGame', {game:this.game["name"], user:this.user});
    this.navCtrl.push('home');
  }

  removeCurrentGame(){

  }

}
