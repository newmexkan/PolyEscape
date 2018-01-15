import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

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



  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventairePage');
  }

  isItemLookingFor(){
    console.log(this.numero);
    this.navCtrl.push('EnigmePage');
  }

  createCode() {
    this.createdCode = this.qrData;

    if(this.createdCode=='test'){
      this.navCtrl.push('')
    }
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
      console.log('Error: ', err);
    });
  }

}
