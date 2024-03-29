import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from '@nebular/auth';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ActivateComponent } from './auth/activation/activate.component';
import { AuthenticationGuard } from './auth/authentication-guard';
import {ForgotPasswordComponent} from "./auth/forgot-password/forgot-password.component";
import {ResendActivationComponent} from "./auth/resend-activation/resend-activation.component";
import {ResetPasswordComponent} from "./auth/reset-password/reset-password.component";
import {environment} from "../environments/environment";

export var routes: Routes
// console.log("PRODUCTION:", environment.production)
if (environment.production){
  routes =  [
  {
    path: '',
    loadChildren: () => import('./landing-page/landing.module')
      .then(m => m.LandingModule),
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
        path: 'login/:id/:password',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'activate',
        component: ActivateComponent
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },{
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'resend-activation',
        component: ResendActivationComponent,
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
}else{
  routes =  [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      }]
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
        path: 'login/:id/:password',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'activate',
        component: ActivateComponent
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },{
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'resend-activation',
        component: ResendActivationComponent,
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
}

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
