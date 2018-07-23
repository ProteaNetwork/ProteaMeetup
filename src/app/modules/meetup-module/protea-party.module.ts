import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetupControllerComponent } from './meetup-controller/meetup-controller.component';
import { InitScreenComponent } from './meetup-controller/init-screen/init-screen.component';
import { AdminScreenComponent } from './meetup-controller/admin-screen/admin-screen.component';
import { AttendeeScreenComponent } from './meetup-controller/attendee-screen/attendee-screen.component';
import { PayoutScreenComponent } from './meetup-controller/payout-screen/payout-screen.component';
import { CreateComponent } from './meetup-controller/create/create.component';
import { FetchComponent } from './meetup-controller/fetch/fetch.component';

// @TODO: Convert controller to auxilary route
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MeetupControllerComponent,
    InitScreenComponent,
    AdminScreenComponent,
    AttendeeScreenComponent,
    PayoutScreenComponent,
    CreateComponent,
    FetchComponent
  ],
  entryComponents: [ InitScreenComponent, AdminScreenComponent, AttendeeScreenComponent, PayoutScreenComponent],
  exports: [MeetupControllerComponent]
})
export class ProteaMeetupModule { }
