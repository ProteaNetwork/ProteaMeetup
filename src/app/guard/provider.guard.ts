import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Web3Service } from './../shared/web3.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanActivate {
  private attempts = 10;

  constructor(private web3: Web3Service, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.queryServiceState();
  }

  private async queryServiceState() {
    if (this.attempts > 0) {
      if (this.web3.ready) {
        return true;
      }
      this.attempts--;
      setTimeout(() => {
        this.queryServiceState();
      }, 100);
    } else {
      this.router.navigate(['/provider-error']);
      return false;
    }
  }
}
