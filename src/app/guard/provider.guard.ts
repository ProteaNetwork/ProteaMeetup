import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Web3Service } from './../shared/web3.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanActivate {
  constructor(private web3: Web3Service, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.web3.ready) {
        this.router.navigate(['/provider-error']);
        return false;
      } else {
        return true;
      }
  }
}
