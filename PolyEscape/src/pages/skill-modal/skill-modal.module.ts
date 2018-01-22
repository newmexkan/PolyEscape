import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkillModalPage } from './skill-modal';

@NgModule({
  declarations: [
    SkillModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SkillModalPage),
  ],
})
export class SkillModalPageModule {}
