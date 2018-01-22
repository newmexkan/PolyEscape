import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Observable} from "rxjs/Observable";
import {Socket} from 'ng-socket-io';
import {Http} from "@angular/http";
import {InventoryProvider} from "../../providers/inventory/inventory";
import {IndicationsProvider} from "../../providers/indications/indications";
import {PlatformHelper} from "../../models/platform-model";

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

  platformHelper;

  qrData = null;
  createdCode = null;
  scannedCode = null;

  numero = null;
  user;
  game;
  questions;
  item;

  listItems: Array<{ name: string, pathImg: string, quantity: number }>;

  constructor(public plt: Platform,private indicationService: IndicationsProvider,public toastCtrl: ToastController, private inventoryService: InventoryProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private barcodeScanner: BarcodeScanner) {

    this.platformHelper = new PlatformHelper(this.plt);

    this.user = navParams.get('user');
    this.game = navParams.get('game');
    console.log("INV");
    console.log(this.game);
    console.log(this.user);

    this.questions = this.game["scenario"]["questions"];
    this.inventoryService.getInventory(this.game.name).subscribe(res => {
      this.listItems = [];
      for (var i = 0; i < res['inventory'].length; i++) {
        this.listItems.push({name: res['inventory'][i].name, pathImg: res['inventory'][i].pathImg, quantity: res['inventory'][i].quantity});
      }
    });

    this.getNewItems().subscribe(item => {
      this.listItems = [];
      for (var i = 0; i < item['game']['inventory'].length; i++) {
        this.listItems.push({name: item['game']['inventory'][i].name, pathImg: item['game']['inventory'][i].pathImg, quantity: item['game']['inventory'][i].quantity});
      }
    });
  }

  recupererItem() {

    let bonItem = false;

    for (let i = 0; i < this.game.missions.length; i++) {

      // le numéro scanné correspond bien à l'item que le user doit rechercher

      if (this.game.missions[i].mission.item == this.numero && this.game.missions[i].player == this.user) {
        bonItem = true;
        this.bonItemToast();
        this.navCtrl.push('EnigmePage', {'questions': this.questions, 'numero': this.numero, 'game': this.game, 'item': {name: this.numero}});
        break;
      }
    }
    if(!bonItem){
      this.mauvaisItemAlert();
    }
  }

  /*endOfGame() {
      this.navCtrl.push('ResultPage', {'win':true});
  }*/



  /*checkEndOfGame(){
    if(this.listItems.length == this.game.missions.length){
      this.endOfGame();
    }
  }*/


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
      subTitle: "Veuillez revoir l'indication de localisation de l'item."+"\n\nVoulez-vous partager une indication à un coéquipier ?",
      buttons: [
        {
          text: 'Non',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: data => {
            alert.present();
            this.showPrompt();
          }
        }]
    });
    alert.present();
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


  createCode() {
    this.createdCode = this.qrData;
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.numero = barcodeData.text;
    }, (err) => {
      console.log('Error: ', err);
    });
    this.recupererItem();
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
