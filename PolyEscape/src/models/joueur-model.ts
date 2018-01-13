export class JoueurModel{

  constructor(public pseudo: string, public id: number, public chief:boolean){

  }

  isChief(){
    return this.chief;
  }

}
