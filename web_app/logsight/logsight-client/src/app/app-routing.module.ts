import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from '@nebular/auth';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingPage } from './landing-page/landing.page';
import { ActivateComponent } from './auth/activation/activate.component';
import { AuthenticationGuard } from './auth/authentication-guard';
import {TermsconditionsPage} from "./landing-page/TermsConditions/termsconditions.page";
import {ImpressumPage} from "./landing-page/Impressum/impressum.page";
import {PrivacypolicyPage} from "./landing-page/PrivacyPolicy/privacypolicy.page";

export const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'impressum',
    component: ImpressumPage
  },
  {
    path: 'privacy-policy',
    component: PrivacypolicyPage,
  },
  {
    path: 'terms-conditions',
    component: TermsconditionsPage,
  },
  {
    path: 'pages',
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'activate/:key',
        component: ActivateComponent
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
