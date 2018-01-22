import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import {Observable} from "rxjs";
import {Socket} from 'ng-socket-io';
import {GameProvider} from "../../providers/game/game";

/**
 * Generated class for the SkillModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-skill-modal',
  templateUrl: 'skill-modal.html',
})
export class SkillModalPage {
  game;
  gameName;
  skillList;
  user;
  skillChosen = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private socket: Socket, private gameService: GameProvider) {
    this.gameName = navParams.get('gameName');
    this.user = navParams.get('user');
    this.gameService.getSkills(this.gameName).subscribe( data => {
      console.log(data);
      this.skillList = [];
      for (let i = 0; i < data['skills'].length; i++){
        this.skillList.push({name: data['skills'][i].name, skillImg: data['skills'][i].skillImg, users: data['skills'][i].users});
      }
      console.log(this.skillList);
    });

    this.getNewSkill().subscribe(data => {
      this.skillList = [];
      for (let i = 0; i < data['skills'].length; i++){
        this.skillList.push({name: data['skills'][i].name, skillImg: data['skills'][i].skillImg, users: data['skills'][i].users});
      }
    });

    this.getPopSkill().subscribe(data => {
      this.skillList = [];
      for (let i = 0; i < data['skills'].length; i++){
        this.skillList.push({name: data['skills'][i].name, skillImg: data['skills'][i].skillImg, users: data['skills'][i].users});
      }
    });
  }



  closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkillModalPage');
  }

  getNewSkill() {
    let observable = new Observable(observer => {
      this.socket.on('skill_chosen', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getPopSkill() {
    let observable = new Observable(observer => {
      this.socket.on('skill_rejected', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  chooseSkill(skill){
    console.log('In chooseSkill');
    this.skillChosen = true;
    this.socket.emit('pickSkill', {game: this.gameName, skillName: skill, user: this.user});
  }

  rejectSkill(skill){
    console.log('In rejectSkill');
    this.skillChosen = false;
    this.socket.emit('rejectSkill', {game: this.gameName, skillName: skill, user: this.user});


  }

  inSkillList(skill){
    return (skill.users.findIndex(i => i === this.user) != -1);
  }

  checkBox(skill){
    if(this.inSkillList(skill) && this.skillChosen){
      this.rejectSkill(skill);
    }
    else if(!this.inSkillList(skill) && !this.skillChosen)
      this.chooseSkill(skill);
    else{}

  }

}
