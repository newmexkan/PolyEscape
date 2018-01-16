import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {IndicationsProvider} from "../../providers/indications/indications";
import {Socket} from 'ng-socket-io';
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  listIndications;
  game;
  constructor(private socket: Socket, private indicationService: IndicationsProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.get('game'));
    this.game = this.navParams.get('game');
    this.getIndications();

    this.getNewIndications().subscribe(res => {
      this.listIndications = [];
      console.log(res.valueOf());
      for (var i = 0; i < res['game']['indications'].length; i++) {
        this.listIndications.push({message: res['game']['indications'][i].message});
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  getIndications(){
    this.indicationService.getIndications(this.game.name).subscribe(res => {
      console.log(res.valueOf());
      this.listIndications = [];
      for (var i = 0; i < res['indications'].length; i++) {
        this.listIndications.push({message: res['indications'][i].message});
      }
    });
  }

  getNewIndications() {
    let observable = new Observable(observer => {
      this.socket.on('indication_added', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Indication',
      message: "Veuillez ajouter une indication pour votre équipe",
      inputs: [
        {
          name: 'message',
          placeholder: 'Indication'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Envoyer',
          handler: data => {
            this.indicationService.addIndications(this.game.name, data.message.valueOf()).subscribe(res => {
              this.socket.emit('indicateClue', {game:res["game"]});
            });
          }
        }
      ]
    });
    prompt.present();
  }


}
