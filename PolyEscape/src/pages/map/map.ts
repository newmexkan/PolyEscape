import {Component, ElementRef, ViewChild} from '@angular/core';
import {Platform,IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {IndicationsProvider} from "../../providers/indications/indications";
import {Socket} from 'ng-socket-io';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation';


/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


declare var google;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})



export class MapPage {

  @ViewChild('map') mapElement: ElementRef;

  private map: any;
  private google: any;


  listIndications;

  game;


  constructor(public platform: Platform, private socket: Socket, private indicationService: IndicationsProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {

    this.game = navParams.get('game');

    this.getIndications();


    this.getNewIndications().subscribe(res => {
      this.listIndications = [];

      for (var i = 0; i < res['game']['indications'].length; i++) {
        this.listIndications.push({message: res['game']['indications'][i].message});
      }
      this.game = res['game'];
    });
  }


  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
    let latLng = new google.maps.LatLng(43.616354, 7.055222);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }



  getIndications(){
    this.indicationService.getIndications(this.game['name']).subscribe(res => {
      console.log(res.valueOf());
      this.listIndications = [];
      for (var i = 0; i < res['indications'].length; i++) {
        this.listIndications.push({message: res['indications'][i].message});
      }
      this.game = res['game'];
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

