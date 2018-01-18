import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventairePage } from './inventaire';
import {NgxQRCodeModule} from "ngx-qrcode2";

@NgModule({
  declarations: [
    InventairePage,
  ],
  imports: [
    IonicPageModule.forChild(InventairePage),
    NgxQRCodeModule
  ],
})
export class InventairePageModule {}
