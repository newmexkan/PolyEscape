import { Component } from '@angular/core';
import {NavController, AlertController, IonicPage, ToastController} from 'ionic-angular';
import { OptionsPage } from '../options/options';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { LobbyPage } from '../lobby/lobby';
import { Socket } from 'ng-socket-io';
import {Observable} from "rxjs";


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

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,private http: Http, private socket:Socket, private toastCtrl: ToastController) {

    this.getNotifications().subscribe(data => {
      this.notify(data.valueOf());
    });

    this.getJoinSuccess().subscribe(data => {
      this.navCtrl.push('LobbyPage', {currentGame: data['game'], currentUser: data['pseudo']});
    });
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
            }, error2 => {
              this.notify("Une partie existante possède le même nom !");
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
              }


            }, error2 => {
              this.notify("Cette partie n'existe pas");
            });

          }
        }
      ]
    });
    prompt.present();
  }

  getJoinSuccess(){
    let observable = new Observable(observer => {
      this.socket.on('join_success', (data) => {
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

  getNotifications(){
    let observable = new Observable(observer => {
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

}
