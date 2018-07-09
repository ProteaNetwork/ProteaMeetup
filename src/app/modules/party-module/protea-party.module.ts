import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyControllerComponent } from './party-controller/party-controller.component';
import { InitScreenComponent } from './init-screen/init-screen.component';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { AttendeeScreenComponent } from './attendee-screen/attendee-screen.component';
import { PayoutScreenComponent } from './payout-screen/payout-screen.component';
import { CreateComponent } from './create/create.component';
import { FetchComponent } from './fetch/fetch.component';

// @TODO: Convert controller to auxilary route
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [PartyControllerComponent, InitScreenComponent, AdminScreenComponent, AttendeeScreenComponent, PayoutScreenComponent, CreateComponent, FetchComponent],
  entryComponents: [ InitScreenComponent, AdminScreenComponent, AttendeeScreenComponent, PayoutScreenComponent],
  exports: [PartyControllerComponent]
})
export class ProteaPartyModule { }
