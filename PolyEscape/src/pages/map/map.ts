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


  listIndications = [];

  game;

  private userLat;
  private userLong;
  private userMarker;


  constructor(public platform: Platform, private socket: Socket, private indicationService: IndicationsProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private geolocation: Geolocation) {

    this.game = navParams.get('game');

    this.getNewIndications().subscribe(res => {
      this.addMarkersToMap(res["markers"]);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.userLat = data.coords.latitude;
      this.userLong = data.coords.longitude;
      this.changeUserMarkerLocation()
    });
  }


  ionViewDidLoad(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
      this.loadMap();
      this.changeUserMarkerLocation()
      this.getExistingIndications();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadMap(){
    let latLng = new google.maps.LatLng(this.userLat, this.userLong);

    let mapOptions = {
      center: latLng,
      zoom: 18,
      zoomControl: false,
      scaleControl: false,
      scrollwheel: false,
      mapTypeId: 'terrain',
      disableDoubleClickZoom: true
    };


    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.setTilt(45);

  }

  addMarkersToMap(markers) {
    for(let marker of markers) {
      const position = new google.maps.LatLng(this.userLat, this.userLong);
      const markerObj = new google.maps.Marker({position: position, title: marker.title});
      this.listIndications.push(markerObj);
      markerObj.setMap(this.map);
    }
  }

  private changeUserMarkerLocation(){
    let latlng = new google.maps.LatLng(this.userLat, this.userLong);

    if(this.userMarker == null){
      this.userMarker = new google.maps.Marker(
        {position: latlng,
          title: "Vous",
          animation: google.maps.Animation.DROP
        });
    }
    else this.userMarker.setPosition(latlng);
  }



  getExistingIndications(){
    this.indicationService.getIndications(this.game['name']).subscribe(res => {
      this.addMarkersToMap(res["indications"]);
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
            let location = {latitude:43.616354,longitude:7.055222,title:data.message};
            this.socket.emit('indicateClue', {gameName:this.game["name"],location:location});
          }
        }
      ]
    });
    prompt.present();
  }


}

