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
import {InventairePageModule} from "../pages/inventaire/inventaire.module";
import {MapPageModule} from "../pages/map/map.module";
import {EquipePageModule} from "../pages/equipe/equipe.module";
import {ScenarioPageModule} from "../pages/scenario/scenario.module";
import {GamePageModule} from "../pages/game/game.module";
import { IndicationsProvider } from '../providers/indications/indications';
import { Geolocation } from '@ionic-native/geolocation';
import { GameProvider } from '../providers/game/game';
import {NativeAudio} from "@ionic-native/native-audio";
import {PlatformHelper} from "../models/platform-model";
import {importType} from "@angular/compiler/src/output/output_ast";
import {Platform} from "ionic-angular";



const config: SocketIoConfig = { url: "http://localhost:8080", options: {} };
//"http://polyescape-server-polyescape-server.193b.starter-ca-central-1.openshiftapps.com"

@NgModule({
  declarations: [
    MyApp,
    OptionsPage,
    SelectScenarioPage,
    OptionsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
    HttpModule,
    HomePageModule,
    LobbyPageModule,
    GamePageModule,
    ScenarioPageModule,
    InventairePageModule,
    MapPageModule,
    EquipePageModule
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
    IndicationsProvider,
    Geolocation,
    NativeAudio,
    GameProvider
  ]
})
export class AppModule {}
