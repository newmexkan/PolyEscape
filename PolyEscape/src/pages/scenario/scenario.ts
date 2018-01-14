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
  private scenario;


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, platform: Platform) {
    this.platform = platform;
    this.scenario = navParams.get('scenario');
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
