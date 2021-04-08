import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { IntegrationService } from '../../@core/service/integration.service';

@Component({
  selector: 'integration',
  styleUrls: ['./integration.page.scss'],
  templateUrl: './integration.page.html',
})
export class IntegrationPage implements OnInit {
  key: string
  applications: Application[] = [];

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.loadApplications()
    })
  }

  createApplication() {
    if (this.key) {
      this.integrationService.createApplication({ name: this.form.controls['name'].value, key: this.key }).subscribe(
        resp => {
          this.loadApplications()
          this.notificationService.success('Success', 'Application successfully created')
        }, error => this.notificationService.error('Error', 'Sorry, a problem happened'))
    } else {
      this.notificationService.error('Error', 'Sorry, a problem happened')
    }
  }

  loadApplications() {
    this.integrationService.loadApplications(this.key).subscribe(resp => this.applications = resp)
  }

}
