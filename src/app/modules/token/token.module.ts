import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManagerComponent } from './account-manager/account-manager.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AccountManagerComponent],
  exports: [ AccountManagerComponent ]
})
export class TokenModule { }
