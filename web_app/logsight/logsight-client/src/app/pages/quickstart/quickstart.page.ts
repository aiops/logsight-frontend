import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IntegrationService} from "../../@core/service/integration.service";
import {AuthenticationService} from "../../auth/authentication.service";
import {NotificationsService} from "angular2-notifications";
import {Application} from "../../@core/common/application";
import {Router} from "@angular/router";

@Component({
  selector: 'quickstart',
  styleUrls: ['./quickstart.page.scss'],
  templateUrl: './quickstart.page.html',
})
export class QuickstartPage implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  key: string;
  email: string;
  applications: Application[] = [];


  constructor(private fb: FormBuilder, private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private router: Router) {
  }


  ngOnInit() {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
    });
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  createApplication() {
    if (this.key) {
      this.integrationService.createApplication({ name: "sample_app", key: this.key }).subscribe(
        resp => {
          this.notificationService.success('Success', 'Sample data is streaming into logsight.ai')
          this.router.navigate(['/pages/dashboard'])
        }, error => this.notificationService.error('Error', 'Sorry, a problem happened'))
    } else {
      this.notificationService.error('Error', 'Sorry, a problem happened')
    }
  }


}
