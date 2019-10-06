import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { GameComponent } from './game/game.component';
import { CircleComponent } from './circle/circle.component';
import { SlashComponent } from './slash/slash.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CircleComponent,
    SlashComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
