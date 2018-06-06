import { Web3Service } from './web3.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [ Web3Service ],
  declarations: [  ],
  exports: [ MaterialModule]
})
export class SharedModule { }
