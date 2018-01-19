import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EquipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-equipe',
  templateUrl: 'equipe.html',
})
export class EquipePage {

  game;
  user;
  isChief : boolean;
  nbUsers = 1;
  users = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.game = navParams.get('game');
    this.user = navParams.get('user');
    this.isChief = (this.user === this.game["chief"]);

    let existingUsers = this.game["players"];
    this.nbUsers = existingUsers.length;

    for (let i = 0; i < existingUsers.length; i++)
      if (existingUsers[i] !== this.user && existingUsers[i] !== this.game["chief"])
        this.users.push(existingUsers[i]);
  }

}
