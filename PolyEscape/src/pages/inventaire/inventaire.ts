import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Observable} from "rxjs/Observable";
import { Socket } from 'ng-socket-io';
import {Http} from "@angular/http";
import { map } from 'rxjs/operators';
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
  numero =null;
  game: any;
  listItems: Array<{name: string, pathImg: string, quantity: number}>;
  constructor(private inventoryService: InventoryProvider ,public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,  private socket: Socket, private http: Http, private barcodeScanner: BarcodeScanner) {
    this.game = navParams.get('game');
    this.listItems = [];
    this.listItems.push({name: "Wood", pathImg: "assets/imgs/wood.png", quantity: 1});
    this.listItems.push({name: "Stone", pathImg: "assets/imgs/wood.png", quantity: 1});
    this.listItems.push({name: "Fire", pathImg: "assets/imgs/wood.png", quantity: 1});
    // this.listItems.push({name: "Talent", pathImg: "assets/imgs/wood.png", quantity: 1});
    // this.listItems.push({name: "Intellect", pathImg: "assets/imgs/wood.png", quantity: 1});
    // this.listItems.push({name: "Strength", pathImg: "assets/imgs/wood.png", quantity: 1});




    this.getInventory();
  }

  getInventory(){
    this.getNewItems().subscribe(item => {
      console.log("In Refresh:  ");
      console.log(item.valueOf());
      console.log(item.toString() );
      for (var i = 0; i < item["inventory"].length; i++) {
        this.listItems.push({name: item["inventory"][i].name, pathImg: item["inventory"][i].pathImg, quantity: item["inventory"][i].quantity});
        console.log("{name:"+ item["inventory"][i].name+",  pathImg: "+item["inventory"][i].pathImg+", quantity: "+item["inventory"][i].quantity+"}");
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventairePage');
  }

  isItemLookingFor(){
    console.log(this.numero);
    this.navCtrl.push('EnigmePage',{'numero':this.numero});
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

  getNewItems(){
    let observable = new Observable(observer => {
      this.socket.on('item_added', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  addItem(){

  }
  sendItem(){
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
                this.socket.emit('addItemToInventory', {game:data["game"].name});
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
