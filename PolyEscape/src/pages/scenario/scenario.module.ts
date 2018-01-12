import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScenarioPage } from './scenario';

@NgModule({
  declarations: [
    ScenarioPage,
  ],
  imports: [
    IonicPageModule.forChild(ScenarioPage),
  ],
})
export class ScenarioPageModule {}
