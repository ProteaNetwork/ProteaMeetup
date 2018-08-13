import { ProteaUser } from '../../shared/interface/user';
import { UportService } from '../../shared/services/uport.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: Subscription;
  fetching = false;


  constructor(private uportService: UportService, private router: Router) {
  }

  ngOnInit() {
    this.checkWeb3();
  }

  ngOnDestroy() {
    this.userData.unsubscribe();
  }

  // @TODO: Refactor to cleaner solution
  // Change to observable
  checkWeb3() {
    this.userData = this.uportService.user$.subscribe((user: ProteaUser) => {
      if (user.address !== '') {
        this.router.navigate(['/']);
      }
    });
  }

  async loginUport() {
    this.fetching = true;
    await this.uportService.login();
    // May need to leave it here unless we add an error, 
    // depends on if one is availabel in uport connect
  }
}
