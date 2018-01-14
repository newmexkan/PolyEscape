import {JoueurModel} from "../../models/joueur-model";
import { GamePage } from "../game/game";
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Navbar} from 'ionic-angular';
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
  joueurs: Array<JoueurModel>;
  game = {};
  users = [];
  user;
  isChief: boolean;

  @ViewChild('navbar') navBar: Navbar;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private socket: Socket,private platform: Platform) {
      this.joueurs =[];
      this.joueurs.push(new JoueurModel("poulet38",1,true));
      this.joueurs.push(new JoueurModel("cordonB",2,false));
      this.joueurs.push(new JoueurModel("Malcom",3,false));
      this.joueurs.push(new JoueurModel("PasDinspi",4,true));


    this.platform.registerBackButtonAction(() => this.backButtonClick, 2)

    this.game = this.navParams.get('currentGame');
    this.user = this.navParams.get('currentUser');
    this.isChief = (this.user === this.game["chief"]);
    console.log(this.user);
    console.log(this.game["chief"]);

    console.log("Game2: "+this.game);
    console.log("User2: "+this.user);

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
    });
  }



  startGame(){
    this.navCtrl.push(this.gamePage,{ 'joueurs': this.joueurs} );
  }

  getNewPlayers(){
    let observable = new Observable(observer => {
      this.socket.on('players_changed', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  backButtonClick(){
      this.quitCurrentGame();
  }


  quitCurrentGame(){
    this.socket.emit('quitGame', {game:this.game["name"], user:this.user});
    this.navCtrl.push('home');
  }

}
