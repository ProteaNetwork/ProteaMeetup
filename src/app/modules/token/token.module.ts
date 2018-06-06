import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManagerComponent } from './account-manager/account-manager.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [AccountManagerComponent],
  exports: [ AccountManagerComponent ]
})
export class TokenModule { }
