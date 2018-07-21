import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ProteaPartyModule } from './modules/party-module/protea-party.module';
import { SharedModule } from './shared/shared.module';
import { TokenModule } from './modules/token/token.module';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PartyDashComponent } from './components/party-dash/party-dash.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    PartyDashComponent,
    LandingPageComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    BrowserAnimationsModule,
    ProteaPartyModule,
    SharedModule,
    TokenModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

