import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyControllerComponent } from './party-controller/party-controller.component';
import { InitScreenComponent } from './party-controller/init-screen/init-screen.component';
import { AdminScreenComponent } from './party-controller/admin-screen/admin-screen.component';
import { AttendeeScreenComponent } from './party-controller/attendee-screen/attendee-screen.component';
import { PayoutScreenComponent } from './party-controller/payout-screen/payout-screen.component';
import { CreateComponent } from './party-controller/create/create.component';
import { FetchComponent } from './party-controller/fetch/fetch.component';

// @TODO: Convert controller to auxilary route
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    PartyControllerComponent,
    InitScreenComponent,
    AdminScreenComponent,
    AttendeeScreenComponent,
    PayoutScreenComponent,
    CreateComponent,
    FetchComponent
  ],
  entryComponents: [ InitScreenComponent, AdminScreenComponent, AttendeeScreenComponent, PayoutScreenComponent],
  exports: [PartyControllerComponent]
})
export class ProteaPartyModule { }
