import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Observable} from "rxjs/Observable";
import {Socket} from 'ng-socket-io';
import {Http} from "@angular/http";
import {map} from 'rxjs/operators';
import {InventoryProvider} from "../../providers/inventory/inventory";

/**
 * Generated class for the InventairePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inventaire',
  templateUrl: 'inventaire.html',
})
export class InventairePage {
  qrData = null;
  createdCode = null;
  scannedCode = null;
  numero = null;
  user;
  game;
  questions;


  listItems: Array<{ name: string, pathImg: string, quantity: number }>;

  constructor(public toastCtrl: ToastController, private inventoryService: InventoryProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private http: Http, private barcodeScanner: BarcodeScanner) {

    this.user = navParams.get('user');
    this.game = navParams.get('game');
    this.questions = this.game.scenario.questions;

    this.listItems = [];
    console.log(this.game.name);
    console.log(this.game);

    this.getNewItems().subscribe(item => {
      console.log(item.valueOf());
      for (var i = 0; i < item['game']['inventory'].length; i++) {
        this.listItems.push({name: item['game']['inventory'][i].name, pathImg: item['game']['inventory'][i].pathImg, quantity: item['game']['inventory'][i].quantity});
      }
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InventairePage');
  }

  recupererItem() {

    let bonItem = false;

    for (let i = 0; i < this.game.missions.length; i++) {

      // le numéro scanné correspond bien à l'item que le user doit rechercher

      if (this.game.missions[i].mission.item == this.numero && this.game.missions[i].player == this.user) {
        bonItem = true;
        this.bonItemToast();
        this.navCtrl.push('EnigmePage', {'questions': this.questions, 'numero': this.numero, 'game': this.game});
        break;
      }
    }
    if(!bonItem){
      this.mauvaisItemAlert();
    }
  }


  bonItemToast() {
    let toast = this.toastCtrl.create({
      message: "Item trouvé ! Répondez à l'énigme pour le récupérer.",
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

  mauvaisItemAlert() {
    let alert = this.alertCtrl.create({
      title: "L'item trouvé n'est pas celui recherché.",
      subTitle: "Veuillez revoir l'indication de localisation de l'item.",
      buttons: ['OK']
    });
    alert.present();
  }

  createCode() {
    this.createdCode = this.qrData;
    this.addItem();
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
      console.log('Error: ', err);
    });
  }

  getNewItems() {
    let observable = new Observable(observer => {
      this.socket.on('item_added', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  addItem() {

  }



}
