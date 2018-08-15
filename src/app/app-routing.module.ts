import { DirectLinkComponent } from './components/direct-link/direct-link.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch : 'full'
  },
  {
    path: 'home',
    component: LandingPageComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'event/:address',
    component: DirectLinkComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// {
//   path: '',
//   redirectTo: '/home',
//   pathMatch : 'full'
// },
// {
//   path: 'home/:address',
//   component: LandingPageComponent,
//   canActivate: [LoginGuard],
// },