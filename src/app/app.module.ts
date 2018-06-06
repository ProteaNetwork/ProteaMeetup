import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ProteaPartyModule } from './party-module/protea-party.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PartyDashComponent } from './party-dash/party-dash.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProviderErrorComponent } from './provider-error/provider-error.component';


@NgModule({
  declarations: [
    AppComponent,
    PartyDashComponent,
    LandingPageComponent,
    ProviderErrorComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    BrowserAnimationsModule,
    ProteaPartyModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
