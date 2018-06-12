import { Web3Service } from './../../shared/web3.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private web3: Web3Service, private router: Router) {
  }

  ngOnInit() {
    this.checkWeb3();
  }

  // @TODO: Refactor to cleaner solution
  // Change to observable
  checkWeb3() {
    setTimeout(() => {
      if (!this.web3.ready) {
        this.checkWeb3();
      } else {
        this.router.navigate(['/']);
      }
    }, 500);
  }

  loginUport() {
    this.web3.login();
  }
}
