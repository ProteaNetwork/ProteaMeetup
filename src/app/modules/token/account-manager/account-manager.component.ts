import { UportService } from '../../../shared/services/uport.service';
import { TokenService } from '../../../shared/services/token.service';
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

  private loading = false;

  constructor(private uportService: UportService, private tokenService: TokenService ) {
    this.user$ = this.uportService.user$.subscribe((_user: ProteaUser) => {
      this.user = _user;
    });
  }

  async ngOnInit() {
    await this.tokenService.initWait();
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
    this.loading = true;
    this.uportService.updateUserObject(await this.tokenService.updateBalances(this.user));
    this.loading = false;
  }

  claimTokens() {
    if (!this.loading) {
      this.loading = true;
      this.tokenService.faucet().then((_result) => {
        this.loading = false;
        this.loadBalances();
        }, (error) => {
        this.loading = false;
        console.error('Claim total error', error);
      });
    }
  }

  resetAccount() {
    if (!this.loading) {
      this.loading = true;
      this.tokenService.resetAccount(this.user.address).then((_result) => {
        this.loading = false;
        this.loadBalances();
        }, (error) => {
          this.loading = false;
          console.error('Claim total error', error);
      });
    }
  }

}
