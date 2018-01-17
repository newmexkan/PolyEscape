import {Component, ViewChild} from '@angular/core';
import { AlertController } from 'ionic-angular';
import {Platform} from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ScenarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scenario',
  templateUrl: 'scenario.html',
})
export class ScenarioPage {
  private platform: Platform;
  game;
  user;
  pathPhoto;



  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, platform: Platform) {
    this.platform = platform;
    this.game = navParams.get('game');
    this.user = navParams.get('user');
    this.pathPhoto = "assets/imgs/";

    /*
    for (let i = 0; i < this.game.missions.length; i++) {
      if (this.game.missions[i].player == this.user) {
        this.pathPhoto = "assets/imgs/"+this.game.missions[i].mission.item+ ".jpg";
      }
    }
*/

    }




  indiceIDphoto() {
    for (let i = 0; i < this.game.missions.length; i++) {
      // le numéro scanné correspond bien à l'item que le user doit rechercher
      if (this.game.missions[i].player == this.user) {
        return ""+i;
      }
    }
  }

  indice() {

    for (let i = 0; i < this.game.missions.length; i++) {
      if (this.game.missions[i].player == this.user) {
          this.indication(this.game.missions[i].mission.message,this.game.missions[i].mission.indice);
      }
    }
  }


  indication(textMission:string,textIndice: string){
    let alert = this.alertCtrl.create({
      title: "Mission :  "+ textMission,
      subTitle: "Indice :  "+  textIndice,
      buttons: ['OK']
    });
    alert.present();
  }


  leave(){
    let alert = this.alertCtrl.create({
      title: 'Quitter',
      message: 'Voulez-vous vraiment quitter la partie ? L\' avancement ne sera pas sauvegardé.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Quitter',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();

  }

}
