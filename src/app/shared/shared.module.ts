import { TokenService } from './token.service';
import { Web3Service } from './web3.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { UportService } from './uport.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  providers: [ Web3Service, TokenService, UportService ],
  declarations: [  ],
  exports: [ MaterialModule, FormsModule]
})
export class SharedModule { }
