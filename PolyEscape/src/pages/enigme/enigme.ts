import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {InventoryProvider} from "../../providers/inventory/inventory";
import { Socket } from 'ng-socket-io';
import {HelpResultPage} from "../help-result/help-result";

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

  helpResultPage =  HelpResultPage;
  public enigme;
  public reponse;
  public questions;
  private item;
  private game;
  private user;
  positionEnigme;


  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams,public alertCtrl: AlertController, private inventoryService: InventoryProvider, private socket: Socket) {
    this.questions = navParams.get('questions');
    console.log("questions");
    console.log(this.questions);


    this.item = navParams.get('item');
    this.user = navParams.get('user');
    this.game = navParams.get('game');
    this.positionEnigme = Math.floor((Math.random()*(this.questions.length-1)));
    this.enigme= this.questions[this.positionEnigme];

  }


  winAlert() {
    let alertWin = this.alertCtrl.create({
      title: 'BONNE REPONSE !',
      subTitle: "Vous venez de trouver un item. Il est ajouté dans l'inventaire commun",
      buttons: [
        {
          text: 'Oui',
          handler: data => {
            this.inventoryService.addItem(this.game.name, this.item.name).subscribe(data => {
              if (data.hasOwnProperty('inventory')) {
                this.socket.emit('addItemToInventory', {game:data["game"], inventory:data["inventory"]});
              }
            });
          }
        }
      ]    });
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

  checkResponse($event: any){
    if($event==this.enigme.reponse){
      this.winAlert();
      // this.sendItem();
    }else{
      this.loseAlert();
    }

  }


  askHelp(){
    let alert = this.alertCtrl.create({
      title: 'Besoin d\'aide ?',
      subTitle: 'Envoyer une demande d\'aide pour cette énigme à vos coéquipiers ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.socket.emit('help_request', {game: this.game.name, user:this.user, question: this.enigme.question, responses: this.enigme.reponses});
            let contactModal = this.modalCtrl.create(this.helpResultPage);
            contactModal.present();
          }
        }
      ]
    });

    alert.present();
  }


}
