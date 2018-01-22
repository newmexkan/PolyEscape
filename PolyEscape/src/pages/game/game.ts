import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { ScenarioPage } from "../scenario/scenario";
import { InventairePage} from "../inventaire/inventaire";
import { EquipePage} from "../equipe/equipe";
import { MapPage} from "../map/map";
import {TimerComponent} from "../../components/timer/timer";
import { Socket } from 'ng-socket-io';
import {Observable} from "rxjs";
import { HomePage} from "../home/home";
import { NativeAudio } from '@ionic-native/native-audio';
import { Events } from 'ionic-angular';

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

  inventoryCount=0;
  mapCount=0;

  mapPage = MapPage;
  scenarioPage = ScenarioPage;
  inventairePage = InventairePage;
  equipePage = EquipePage;
  homePage = HomePage;

  private players = [];
  game;
  user;
  time;

  @ViewChild(TimerComponent) timer: TimerComponent;


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private socket: Socket, private alertCtrl: AlertController,private nativeAudio: NativeAudio,public events: Events) {
    this.game = navParams.get('game');
    this.user = navParams.get('user');
    this.time = this.game["scenario"]["timeInMinuts"]*60;
    this.players.push(this.game["chief"]);

    for(let i =0; i<this.game["players"];i++)
      this.players.push(this.game["players"][i]);

    this.getNotifications().subscribe(data => {
      this.notify(data["message"]);

      if(data["subject"]==="inventory")
        this.inventoryCount++;

      if(data["subject"]==="map")
        this.mapCount++;

    });

    this.getEndOfGame().subscribe(data => {
      this.navCtrl.push('ResultPage',data);
    });

    this.nativeAudio.preloadSimple('light', 'assets/audio/light.mp3');

    this.getHelpRequest().subscribe(data => {
      let alert = this.alertCtrl.create({
        title: 'Michel a besoin de ton aide !',
        message: "Quel est votre solution pour l'énigme : 'koman sa va ??'",
        inputs: [
          {
            name: 'answer',
            placeholder: 'Réponse',
          }
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: data => {
              this.socket.emit('help_request_empty', {game: this.game["name"], user: this.user});
            }
          },
          {
            text: 'Envoyer',
            handler: data => {
              this.socket.emit('help_request_response', {game: this.game["name"], answer: data.answer, user: this.user});
            }
          }
        ]
      });
      alert.present();

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

  getHelpRequest(){
    let observable = new Observable(observer => {
      this.socket.on('help_request', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getEndOfGame(){
    let observable = new Observable(observer => {
      this.socket.on('end_of_game', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  notify(message) {
    this.nativeAudio.play('light');
    let toast = this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();

  }

  leave(){
    let alert = this.alertCtrl.create({
      title: 'Quitter la partie',
      message: 'En abandonnant vous provoquerez l\'echec de toute votre équipe. Voulez-vous abandonner la partie ?',
      buttons: [
        {
          text: 'Rester',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Abandonner',
          handler: () => {
            this.socket.emit('quitGame', {game: this.game["name"], user: this.user});
          }
        }
      ]
    });
    alert.present();

  }

  resetNotifMap(){
    this.mapCount = 0;
  }

  resetNotifInventory(){
    this.inventoryCount = 0;
  }




}
