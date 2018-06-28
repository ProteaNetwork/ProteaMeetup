import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {

  constructor(private web3: Web3Service) { }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  ngOnInit() {
  }

}
