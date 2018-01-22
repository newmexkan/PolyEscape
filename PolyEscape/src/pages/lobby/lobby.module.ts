
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LobbyPage } from './lobby';
import {SkillModalPage} from "../skill-modal/skill-modal";

@NgModule({
  declarations: [
    LobbyPage,
    SkillModalPage
  ],
  imports: [
    IonicPageModule.forChild(LobbyPage),
  ],
  entryComponents: [
    SkillModalPage
  ],
})
export class LobbyPageModule {}
