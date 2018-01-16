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
    this.listItems.push({name: "Wood", pathImg: "assets/imgs/wood.png", quantity: 1});
    this.listItems.push({name: "Stone", pathImg: "assets/imgs/wood.png", quantity: 1});
    this.listItems.push({name: "Fire", pathImg: "assets/imgs/wood.png", quantity: 1});
    // this.listItems.push({name: "Talent", pathImg: "assets/imgs/wood.png", quantity: 1});
    // this.listItems.push({name: "Intellect", pathImg: "assets/imgs/wood.png", quantity: 1});
    // this.listItems.push({name: "Strength", pathImg: "assets/imgs/wood.png", quantity: 1});


    this.getInventory();
  }

  getInventory() {
    this.getNewItems().subscribe(item => {
      console.log("In Refresh:  ");
      console.log(item.valueOf());
      console.log(item.toString());
      for (var i = 0; i < item["inventory"].length; i++) {
        this.listItems.push({
          name: item["inventory"][i].name,
          pathImg: item["inventory"][i].pathImg,
          quantity: item["inventory"][i].quantity
        });
        console.log("{name:" + item["inventory"][i].name + ",  pathImg: " + item["inventory"][i].pathImg + ", quantity: " + item["inventory"][i].quantity + "}");
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
        this.navCtrl.push('EnigmePage', {'questions': this.questions, 'numero': this.numero});
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

  sendItem() {
    this.createdCode = this.qrData;

    let prompt = this.alertCtrl.create({
      title: 'Vous avez trouvé un item !!!',
      message: this.createdCode,
      buttons: [
        {
          text: 'Non',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: data => {
            this.inventoryService.addItem(this.game.name, this.createdCode).subscribe(data => {
              if (data.hasOwnProperty('inventory')) {
                // console.log(data.inventory[-1]);
                this.socket.emit('addItemToInventory', {game: data["game"].name});
                // this.navCtrl.push('LobbyPage', {currentGame: response.game, currentUser: data.pseudo});
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }


  // showQRItem(item){
  //   let prompt = this.alertCtrl.create({
  //     title: 'Un item a été trouvé !!!',
  //     message: item.name,
  //     buttons: [
  //       {
  //         text: 'Ajouter',
  //         handler: data => {
  //           this.http.get('http://localhost:8080/getGame/'+ data.nom).pipe(
  //             map(res => res.json())
  //           ).subscribe(response => {
  //             if (response.hasOwnProperty('game')) {
  //               this.socket.connect();
  //               this.socket.emit('joinGame', {game:data.nom, user:data.pseudo});
  //               this.navCtrl.push('LobbyPage', {currentGame: response.game, currentUser: data.pseudo});
  //             }
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }


}
