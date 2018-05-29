import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProviderErrorComponent } from './provider-error/provider-error.component';
import { ProviderGuard } from './guard/provider.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [ProviderGuard],
  },
  {
    path: '/provider-error',
    component: ProviderErrorComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
