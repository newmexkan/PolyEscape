import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OptionsPage } from '../pages/options/options';
import { LobbyPage } from "../pages/lobby/lobby";

import { HttpModule } from '@angular/http';
import { TimerComponent} from "../components/timer/timer";


import {HttpClientModule} from "@angular/common/http";
import {GamePage} from "../pages/game/game";
import {InventairePage} from "../pages/inventaire/inventaire";
import {ScenarioPage} from "../pages/scenario/scenario";
import {EquipePage} from "../pages/equipe/equipe";
import {MapPage} from "../pages/map/map";
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import {HomePageModule} from "../pages/home/home.module";
import {LobbyPageModule} from "../pages/lobby/lobby.module";
import {SelectScenarioPage} from "../pages/select-scenario/select-scenario";
import {ScenarioServiceProvider} from "../providers/scenario-service/scenario-service";
import {InventoryProvider} from "../providers/inventory/inventory";
import { IndicationsProvider } from '../providers/indications/indications';
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [
    MyApp,
    OptionsPage,
    SelectScenarioPage,
    OptionsPage,
    GamePage,
    InventairePage,
    ScenarioPage,
    EquipePage,
    MapPage,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
    HttpModule,
    HomePageModule,
    LobbyPageModule,
    NgxQRCodeModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OptionsPage,
    SelectScenarioPage,
    OptionsPage,
    LobbyPage,
    GamePage,
    InventairePage,
    ScenarioPage,
    EquipePage,
    MapPage,
    TimerComponent

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    InventoryProvider,
    ScenarioServiceProvider,
    IndicationsProvider
  ]
})
export class AppModule {}
