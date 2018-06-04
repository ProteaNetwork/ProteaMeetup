import { Web3Service } from './web3.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteaTokenContractComponent } from './components/protea-token-contract/protea-token-contract.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ Web3Service ],
  declarations: [ ProteaTokenContractComponent ]
})
export class SharedModule { }
