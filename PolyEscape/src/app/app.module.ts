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
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {GamePage} from "../pages/game/game";
import {InventairePage} from "../pages/inventaire/inventaire";
import {ScenarioPage} from "../pages/scenario/scenario";
import {EquipePage} from "../pages/equipe/equipe";
import {MapPage} from "../pages/map/map";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OptionsPage,
    OptionsPage,
    LobbyPage,
    GamePage,
    InventairePage,
    ScenarioPage,
    EquipePage,
    MapPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OptionsPage,
    OptionsPage,
    LobbyPage,
    GamePage,
    InventairePage,
    ScenarioPage,
    EquipePage,
    MapPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
