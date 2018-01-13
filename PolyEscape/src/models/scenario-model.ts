import {MissionModel} from "./mission-model";

export class ScenarioModel {

  constructor(public id: number, public name: string, public nbGamers: number, public timeInMinuts: number, public summary: string, public missions: MissionModel[]) {

  }
}
/*
  var scenario1 = {
    id: 1,
    name:"Invasion de zombies",
    nbGamers:3,
    timeInMinuts:30,
    summary:"SophiaTech a été envahi par des hordes de zombies, pour vous en sortir vivant et " +
    "trouver une issue, vous devez envoyer un petit robot d’exploration.",
    missions:[{message:"Trouver un Arduino",item:0}, {message:"Trouver le programme C",item:1}, {message:"Trouver des capteurs",item:2}]
  };
*/
