/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbAlertModule, NbButtonModule,
  NbChatModule, NbCheckboxModule,
  NbDatepickerModule,
  NbDialogModule, NbInputModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginService } from './auth/login.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LandingPage } from './landing-page/landing.page';
import { ActivateComponent } from './auth/activation/activate.component';
import { AuthHttpInterceptor } from './auth/auth-http-interceptor';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { MatCardModule } from '@angular/material/card';
import { PrivacypolicyPage } from './landing-page/PrivacyPolicy/privacypolicy.page';
import { ImpressumPage } from './landing-page/Impressum/impressum.page';
import { TermsconditionsPage } from './landing-page/TermsConditions/termsconditions.page';
import { TooltipModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, LandingPage, PrivacypolicyPage, ImpressumPage,
    TermsconditionsPage, ActivateComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    TourMatMenuModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbAlertModule,
    NbInputModule,
    NbCheckboxModule,
    ReactiveFormsModule,
    NbButtonModule,
    SimpleNotificationsModule.forRoot(),
    HighlightModule,
    MatCardModule,
    TooltipModule
  ],
  bootstrap: [AppComponent],
  providers: [LoginService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptor,
    multi: true
  },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    },
  ]
})
export class AppModule {
}
