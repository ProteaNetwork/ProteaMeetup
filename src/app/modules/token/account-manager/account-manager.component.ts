import { UportService } from './../../../shared/uport.service';
import { TokenService } from '../../../shared/token.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProteaUser } from '../../../shared/interface/user';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit, OnDestroy {
  public user: ProteaUser;
  private user$: Subscription;

  private transacting = false;

  constructor(private uportService: UportService, private tokenService: TokenService ) {
    this.user$ = this.uportService.user$.subscribe((_user: ProteaUser) => {
      this.user = _user;
    });
  }

  ngOnInit() {
    this.loadBalances();
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  isValidAddress(address: string) {
    return this.uportService.isValidAddress(address);
  }

  // Controls

  async loadBalances() {
    this.uportService.updateUserObject(await this.tokenService.updateBalances(this.user));

  }

  claimTokens() {
    if (!this.transacting) {
      this.transacting = true;
      this.tokenService.faucet().then((_result) => {
        this.transacting = false;
        this.loadBalances();
        }, (error) => {
        this.transacting = false;
        console.error('Claim total error', error);
      });
    }
  }

  resetAccount() {
    if (!this.transacting) {
      this.transacting = true;
      this.tokenService.resetAccount(this.user.address).then((_result) => {
        this.transacting = false;
        this.loadBalances();
        }, (error) => {
          this.transacting = false;
          console.error('Claim total error', error);
      });
    }
  }

}
