import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Observable} from "rxjs/Rx";
import { Socket } from 'ng-socket-io';

/**
 * Generated class for the HelpResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help-result',
  templateUrl: 'help-result.html',
})
export class HelpResultPage {
  private answers = [];
  public isWaiting;

  constructor(public navCtrl: NavController, public socket: Socket, public navParams: NavParams, public viewCtrl: ViewController) {
    this.isWaiting = true;

    this.getHelpRequestResults().subscribe(data => {
      this.answers = data['answers'];
      this.isWaiting = false;
    });
  }


  getHelpRequestResults(){
    let observable = new Observable(observer => {
      this.socket.on('help_request_results', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
  close(){
    this.viewCtrl.dismiss();
  }

}
