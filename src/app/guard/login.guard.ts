import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Web3Service } from './../shared/web3.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private attempts = 10;

  constructor(private web3: Web3Service, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const valid = await this.queryServiceState();
    if (!valid) {
      this.router.navigate(['/login']);
    }
    return valid;
  }

  private async queryServiceState() {
    for (let i = 0; i < this.attempts; i++) {
      const delay = new Promise(resolve => setTimeout(resolve, 200));
      await delay;
      if (this.web3.ready) {
        return true;
      }
    }
    return false;
  }
}
