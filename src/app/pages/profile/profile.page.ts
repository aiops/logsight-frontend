import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../auth/authentication.service";
import {HighlightResult} from "ngx-highlightjs";
import {IntegrationService} from "../../@core/service/integration.service";
import {NotificationsService} from "angular2-notifications";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../auth/login.service";
import {ApiService} from "../../@core/service/api.service";
import {Application} from "../../@core/common/application";
import {LogsightUser} from "../../@core/common/logsight-user";

@Component({
  selector: 'profile', styleUrls: ['./profile.page.scss'], templateUrl: './profile.page.html',
})
export class ProfilePage implements OnInit {
  key: string;
  email: string;
  quantity: number;
  response: HighlightResult;
  isMatching = true;
  formPassword = new FormGroup({
    userId: new FormControl(''),
    oldPassword: new FormControl('', Validators.minLength(8)),
    newPassword: new FormControl('', Validators.minLength(8)),
    repeatNewPassword: new FormControl('', Validators.minLength(8))
  });
  id: string;

  form = new FormGroup({
    name: new FormControl('', Validators.pattern(`^[a-z0-9_-]*$`)),
  });
  view: any[] = [400, 200];
  colorScheme = {
    domain: ['#00ff00', '#ff0000', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  units: string = 'GBs';

  userId: string;

  user: LogsightUser | null
  applicationId: string;
  isSpinning = false;
  applications: Application[] = [];
  applicationName: string;


  constructor(private router: Router, private integrationService: IntegrationService, private authService: AuthenticationService, private notificationService: NotificationsService, private route: ActivatedRoute, private loginService: LoginService, private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.authService.getLoggedUser(this.userId).subscribe(resp => {
      this.email = resp.email
      this.id = resp.userId
      this.user = resp
    })
    this.loadApplications(this.userId)
  }

  applicationSelected(appId: string) {
    this.applications.forEach(it => {
      if (appId == it.applicationId) {
        this.applicationName = it.name
      }
    })
    appId === null ? this.applicationId = null : this.applicationId = appId;
  }


  changePassword() {
    this.formPassword.get("userId").setValue(this.id)
    let newPassword = this.formPassword.value.newPassword
    let newPasswordRetry = this.formPassword.value.repeatNewPassword
    if (newPassword != newPasswordRetry) {
      this.isMatching = false
    } else {
      this.isMatching = true
      this.loginService.changePassword(this.formPassword.value).subscribe(resp => {
        this.notificationService.success("Success", "The password was successfully updated.", this.apiService.getNotificationOpetions())
      }, error => {
        this.apiService.handleErrors(error)
      })
    }
  }


  createApplication() {
    this.isSpinning = true
    if (this.form) {
      this.integrationService.createApplication(this.userId, {applicationName: this.form.get("name").value}).subscribe(resp => {
        setTimeout(_ => {
          this.applicationSelected(resp.applicationId);
        }, 50);
        this.loadApplications(this.userId);
        this.form.reset()
        this.isSpinning = false
        this.notificationService.success("Application created", "Application successfully created.", this.apiService.getNotificationOpetions())
      }, error => {
        this.apiService.handleErrors(error)
        this.isSpinning = false
      })
    }
  }

  removeApplication(id: string) {
    this.integrationService.deleteApplication(this.userId, id).subscribe(resp => {
      this.notificationService.success('Success', 'Application successfully deleted', this.apiService.getNotificationOpetions())
      this.loadApplications(this.userId)
    }, error => {
      this.apiService.handleErrors(error)
    })
  }

  loadApplications(userId: string) {
    this.integrationService.loadApplications(userId).subscribe(resp => {
      this.applications = resp.applications
    })
  }
}
