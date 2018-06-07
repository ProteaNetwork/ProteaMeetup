import { Observable, Subscription } from 'rxjs';
import { Web3Service } from './../../shared/web3.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-error',
  templateUrl: './provider-error.component.html',
  styleUrls: ['./provider-error.component.scss']
})
export class ProviderErrorComponent implements OnInit {

  constructor(private web3: Web3Service, private router: Router) {
  }

  ngOnInit() {
    this.checkWeb3();
  }

  // @TODO: Refactor to cleaner solution
  checkWeb3() {
    setTimeout(() => {
      if (!this.web3.ready) {
        this.checkWeb3();
      } else {
        this.router.navigate(['/']);
      }
    }, 500);
  }
}
