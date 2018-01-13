import {ScenarioModel} from "./scenario-model";
import {JoueurModel} from "./joueur-model";

export class GameModel{

  joueurs: Array<JoueurModel>;

  constructor(public scenario:ScenarioModel, chef:JoueurModel){
    this.joueurs.push(chef)
  }

  addPlayer(newPlayer: JoueurModel){
    this.joueurs.push(newPlayer);
  }

  canStart(){
    if(this.scenario.nbGamers<=this.joueurs.length)
      return true;
    return false;
  }

}
