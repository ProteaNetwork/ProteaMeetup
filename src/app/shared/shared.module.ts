import { Web3Service } from './web3.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteaTokenContractComponent } from './components/protea-token-contract/protea-token-contract.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [ Web3Service ],
  declarations: [ ProteaTokenContractComponent ],
  exports: [ MaterialModule]
})
export class SharedModule { }
