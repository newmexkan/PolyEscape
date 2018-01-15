import { Component } from '@angular/core';
import {NavController, AlertController, IonicPage} from 'ionic-angular';
import { OptionsPage } from '../options/options';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
//import {SelectScenarioPage} from "../select-scenario/select-scenario";
import { LobbyPage } from '../lobby/lobby';
import { Socket } from 'ng-socket-io';

@IonicPage({
  name: "home",
  segment: "app"
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  optionsPage = OptionsPage;
  lobbyPage = LobbyPage;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,private http: Http, private socket:Socket) {

  }
  askNameNewGame() {
    let prompt = this.alertCtrl.create({
      title: 'Créer une partie',
      message: "Entrez le nom de la nouvelle partie ainsi que votre pseudo",
      inputs: [
        {
          name: 'nom',
          placeholder: 'Nom de la partie'
        },
        {
          name: 'pseudo',
          placeholder: 'Votre pseudo'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Créer',
          handler: data => {
            this.http.get('http://localhost:8080/addGame/'+ data.nom+'/'+data.pseudo).pipe(
              map(res => res.json())
            ).subscribe(response => {
              if (response.hasOwnProperty('game')) {
                this.socket.connect();
                this.socket.emit('createGame', {game: data.nom, user: data.pseudo});
                this.navCtrl.push('LobbyPage', {currentGame: response.game, currentUser: data.pseudo});
              }
            });

          }
        }
      ]
    });
    prompt.present();
  }

  askNameExistingGame() {
    let prompt = this.alertCtrl.create({
      title: 'Rejoindre une partie',
      message: "Entrez le nom de la partie existante ainsi que votre pseudo",
      inputs: [
        {
          name: 'nom',
          placeholder: 'Nom de la partie'
        },
        {
          name: 'pseudo',
          placeholder: 'Votre pseudo'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Rejoindre',
          handler: data => {
            this.http.get('http://localhost:8080/getGame/'+ data.nom).pipe(
              map(res => res.json())
            ).subscribe(response => {
              if (response.hasOwnProperty('game')) {
                this.socket.connect();
                this.socket.emit('joinGame', {game:data.nom, user:data.pseudo});
                this.navCtrl.push('LobbyPage', {currentGame: response.game, currentUser: data.pseudo});
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }

}
