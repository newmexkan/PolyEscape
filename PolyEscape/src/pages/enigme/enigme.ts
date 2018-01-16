import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {InventoryProvider} from "../../providers/inventory/inventory";
import { Socket } from 'ng-socket-io';

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
  public questions;
  private item;
  private game;
  positionEnigme;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController, private inventoryService: InventoryProvider, private socket: Socket) {
    this.questions = navParams.get('questions');
    this.item = navParams.get('item');
    this.game = navParams.get('game');
    this.positionEnigme = Math.floor((Math.random()*(this.questions.length-1)));
    this.enigme= this.questions[this.positionEnigme];

    console.log(this.game.valueOf());


 //   this.enigme={question:"Quel est le département associé au code postal 42 ?",reponse:"loire"};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnigmePage');
  }

  winAlert() {
    let alertWin = this.alertCtrl.create({
      title: 'BONNE REPONSE !',
      subTitle: "Vous avez trouvé la réponse de l'énigme.\n Voulez-vous l'ajouter à l'inventaire commun?",
      buttons: [
        {
          text: 'Non, je veux perdre...',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: data => {
            this.inventoryService.addItem(this.game.name, {name: this.item, id: 0}).subscribe(data => {
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

  sendItem(){

    let prompt = this.alertCtrl.create({
      title: 'Vous avez trouvé un item !!!',
      message: this.item,
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
            this.inventoryService.addItem(this.game.name, this.item).subscribe(data => {
              if (data.hasOwnProperty('inventory')) {
                // console.log(data.inventory[-1]);
                console.log(data.valueOf());
                console.log(data["game"]);
                this.socket.emit('addItemToInventory', {game:data["game"], inventory:data["inventory"]});
                // this.navCtrl.push('LobbyPage', {currentGame: response.game, currentUser: data.pseudo});
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }


}
