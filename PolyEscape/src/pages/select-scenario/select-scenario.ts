import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ScenarioServiceProvider} from "../../providers/scenario-service/scenario-service";

/**
 * Generated class for the SelectScenarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-scenario',
  templateUrl: 'select-scenario.html',
  providers: [ScenarioServiceProvider],
})
export class SelectScenarioPage {

  list: any;

  listeScenarios: Array<{
    id: number,
    name: string,
    nbGamers: number,
    timeInMinuts: number,
    summary: string,
    missions: Array<{message: string, item: number}>
  }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private scenarioService: ScenarioServiceProvider) {
    this.listeScenarios = [];
    this.create();
  }

  create(){
    this.scenarioService.getAllScenarios().subscribe(res => {
      console.log("In Create");
      // console.log(res.scenarios[0].missions);
      var keys = Object.keys(res.scenarios);
      for(var i = 0; i < keys.length; ++i ){
        var missions: any;
         missions = [];

        for(var j in res.scenarios[keys[i]].missions ){
          missions.push({message: res.scenarios[keys[i]].missions[j].message, item: res.scenarios[keys[i]].missions[j].item});
        }
        // console.log(missions);
        var elmt = {
          id: res.scenarios[i].id,
          name: res.scenarios[i].name,
          nbGamers: res.scenarios[i].nbGamers,
          timeInMinuts: res.scenarios[i].timeInMinuts,
          summary: res.scenarios[i].summary,
          missions: missions
        };
        // console.log(elmt);
        this.listeScenarios.push(elmt);
      }
    });
    console.log(this.listeScenarios);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectScenarioPage');
  }

}
