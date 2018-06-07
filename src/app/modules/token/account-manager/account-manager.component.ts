import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';
import * as TruffleContract from 'truffle-contract';
import { ContractsService } from '../../../shared/contracts.service';


@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {
  public tokenContract: TruffleContract;

  constructor(private web3: Web3Service, private contracts: ContractsService) { }

  ngOnInit() {
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }
}
