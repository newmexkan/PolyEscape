import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Observable} from "rxjs/Observable";
import { Socket } from 'ng-socket-io';
import {Http} from "@angular/http";
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
  user;
  game;
  questions;


  listItems: Array<{name: string, pathImg: string, quantity: number}>;

  constructor(private inventoryService: InventoryProvider ,public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,  private socket: Socket, private http: Http, private barcodeScanner: BarcodeScanner) {

    this.user = navParams.get('user');
    this.game = navParams.get('game');
    this.questions = this.game.scenario.questions;

    this.listItems = [];
    console.log(this.game.name);
    console.log(this.game);
    this.getInventory();

    this.getNewItems().subscribe(item => {
      console.log("In Refresh: ");
      console.log(item.valueOf());

      for (var i = 0; i < item.game.inventory.length; i++) {
        console.log(i);
        this.listItems.push({name: item.game.inventory[i].name, pathImg: item.game.inventory[i].pathImg, quantity: item.game.inventory[i].quantity});
        console.log("{name:"+ item.game.inventory[i].name+",  pathImg: "+item.game.inventory[i].pathImg+", quantity: "+item.game.inventory[i].quantity+"}");
      }
    });
    console.log("listItems = ");
    console.log(this.listItems);

  }


  getInventory(){
    this.inventoryService.getInventory(this.game.name).subscribe(item => {
      console.log(item.valueOf());
      for (var i = 0; i < item.length; i++) {
        this.listItems.push({name: item[i].name, pathImg: item[i].pathImg, quantity: item[i].quantity});
        console.log("{name:"+ item[i].name+",  pathImg: "+item[i].pathImg+", quantity: "+item[i].quantity+"}");
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventairePage');
  }

  recupererItem(){
    console.log(this.numero);
    this.navCtrl.push('EnigmePage',{'questions':this.questions,'numero':this.numero, 'game': this.game, 'item': this.createdCode});
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
        // console.log(data.valueOf());
        observer.next(data);
      });
    });
    return observable;
  }

  addItem(){

  }



}
