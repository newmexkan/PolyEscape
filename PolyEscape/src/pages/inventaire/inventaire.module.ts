import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventairePage } from './inventaire';

@NgModule({
  declarations: [
    InventairePage,
  ],
  imports: [
    IonicPageModule.forChild(InventairePage),
  ],
})
export class InventairePageModule {}
