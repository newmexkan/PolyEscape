import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the EnigmePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enigme',
  templateUrl: 'enigme.html',
})
export class EnigmePage {

  public enigme;
  public reponse;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
    this.enigme={question:"Quel est le département associé au code postal 42 ?",reponse:"loire"};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnigmePage');
  }

  winAlert() {
    let alertWin = this.alertCtrl.create({
      title: 'BONNE REPONSE !',
      subTitle: "Vous avez trouvé la réponse de l'énigme, vous récuperez l'item.",
      buttons: ['OK']
    });
    alertWin.present();
    this.navCtrl.pop();
  }

  loseAlert(){
    let alert = this.alertCtrl.create({
      title: 'MAUVAISE REPONSE !',
      subTitle: "Veuillez réessayer de répondre à l'énigme.",
      buttons: ['OK']
    });
    alert.present();
  }

  envoyerReponse(){
    if(this.reponse==this.enigme.reponse){
      this.winAlert();
    }else{
      this.loseAlert();
    }

  }

}
