import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnigmePage } from './enigme';

@NgModule({
  declarations: [
    EnigmePage,
  ],
  imports: [
    IonicPageModule.forChild(EnigmePage),
  ],
})
export class EnigmePageModule {}
