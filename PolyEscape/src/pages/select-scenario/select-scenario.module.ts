import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectScenarioPage } from './select-scenario';

@NgModule({
  declarations: [
    SelectScenarioPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectScenarioPage),
  ],
})
export class SelectScenarioPageModule {}
