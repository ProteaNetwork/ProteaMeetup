import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyControllerComponent } from './party-controller/party-controller.component';
import { InitScreenComponent } from './init-screen/init-screen.component';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { AttendeeScreenComponent } from './attendee-screen/attendee-screen.component';
import { PayoutScreenComponent } from './payout-screen/payout-screen.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PartyControllerComponent, InitScreenComponent, AdminScreenComponent, AttendeeScreenComponent, PayoutScreenComponent],
  exports: [PartyControllerComponent]
})
export class ProteaPartyModule { }
