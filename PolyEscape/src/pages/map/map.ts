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

  listIndications = [];
  game;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private indicationService: IndicationsProvider, public alertCtrl: AlertController) {

    this.game = navParams.get('game');

    //this.listIndications = this.game["indications"];

    this.indicationService.getIndications(this.game['name']).subscribe(res => {
      console.log(res.valueOf());
      this.listIndications = [];
      for (var i = 0; i < res["game"]['indications'].length; i++) {
        this.listIndications.push({message: res["game"]['indications'][i].message});
      }
      this.game = res['game'];
    });



    this.getNewIndications().subscribe(res => {
      console.log("RES");
      console.log(res);
      this.listIndications = [];

      for (var i = 0; i < res["game"]["indications"].length; i++) {
        this.listIndications.push({message: res["game"]["indications"][i].message});
      }
      this.game = res["game"];
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
              this.socket.emit('indicateClue', {game:res["game"]["name"]});
            });
          }
        }
      ]
    });
    prompt.present();
  }


}
