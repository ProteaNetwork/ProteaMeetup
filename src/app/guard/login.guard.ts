import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UportService } from '../shared/uport.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private attempts = 10;

  constructor(private uportService: UportService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const valid = await this.queryServiceState();
    if (!valid) {
      this.router.navigate(['/login']);
    }
    return valid;
  }

  private async queryServiceState() {
    // Refactor to observable pattern
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
