import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
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
import {HelpResultPage} from "../help-result/help-result";

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

  inventoryCount =0;
  helpResultPage =  HelpResultPage;
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


  constructor(public navCtrl: NavController, public modalCtrl: ModalController,  public navParams: NavParams, public toastCtrl: ToastController, private socket: Socket, private alertCtrl: AlertController,private nativeAudio: NativeAudio,public events: Events) {
    this.game = navParams.get('game');
    console.log(this.game["scenario"]["mission"]);
    this.user = navParams.get('user');
    this.time = this.game["scenario"]["timeInMinuts"]*60;
    this.players.push(this.game["chief"]);

    for(let i =0; i<this.game["players"];i++)
      this.players.push(this.game["players"][i]);

    this.getNotifications().subscribe(data => {
      this.notify(data["message"]);

      if(data["subject"]==="inventory")
        this.inventoryCount++;

    });

    this.getEndOfGame().subscribe(data => {
      this.navCtrl.push('ResultPage',data);
    });



    this.nativeAudio.preloadSimple('light', 'assets/audio/light.mp3');

    this.getHelpRequest().subscribe(data => {

      let alert = this.alertCtrl.create();
      alert.setTitle(data['user']+' a besoin d\'aide pour cette énigme :');
      alert.setMessage(data['question'])

      let responses = data['responses']
      for (var i = 0; i <3; i++) {
        alert.addInput({
          type: 'radio',
          label: responses[i],
          value: ''+i,
          checked: false
        });
      }

      alert.addButton({
        text: 'Ignorer',
        handler: (data: any) => {
          this.socket.emit('help_request_empty', {game: this.game["name"]});
        }
      });

      alert.addButton({
        text: 'Envoyer',
        handler: (data: any) => {
          this.socket.emit('help_request_response', {game: this.game["name"], answer: responses[parseInt(data)]});
        }
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




}
