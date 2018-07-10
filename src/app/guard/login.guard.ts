import { ProteaUser } from './../shared/interface/user';
import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UportService } from '../shared/uport.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, OnDestroy {
  private ready: boolean;
  private user$: Subscription;

  constructor(private uportService: UportService, private router: Router) {
    this.user$ = this.uportService.user$.subscribe(
      (user: ProteaUser) =>
      (user.address !== '') ? this.ready = true : null );
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  canActivate(): boolean {
    if (!this.ready) {
      this.router.navigate(['/login']);
    }
    return this.ready;
  }
}
