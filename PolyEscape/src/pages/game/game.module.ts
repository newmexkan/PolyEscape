import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GamePage } from './game';
import {TimerComponent} from "../../components/timer/timer";


@NgModule({
  declarations: [
    GamePage,
    TimerComponent

  ],
  imports: [
    IonicPageModule.forChild(GamePage)
  ]
})
export class GamePageModule {}
