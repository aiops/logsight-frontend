import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {Application} from '../../@core/common/application';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiService} from "../../@core/service/api.service";
import {LogsightUser} from "../../@core/common/logsight-user";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'file-upload',
  styleUrls: ['./file-upload.page.scss'],
  templateUrl: './file-upload.page.html',
})
export class FileUploadPage implements OnInit {
  email: string;
  user: LogsightUser | null
  applicationId: string;
  isSpinning = false;
  applications: Application[] = [];
  applicationName: string;
  public show: boolean = false;
  public uploadFile: boolean = true;
  public formData = new FormData();
  userId: string;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.authService.getLoggedUser(this.userId).subscribe(resp => {
      this.user = resp
      }
    )
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


  uploadFiles(file) {
    this.formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      this.formData.append("file", file[i], file[i]['name']);
    }
    this.notificationService.success("File not selected", "Click the upload button to send the log file.", this.apiService.getNotificationOpetions())
  }

  getAppName(appName: string) {
    return appName.replace(/\W/g, '').replace(/\.[^/.]+$/, "")
  }

  requestUpload() {
    this.isSpinning = true
    if (this.applicationName) {
          this.formData.set("applicationId", this.applicationId)
          this.http.post(`/api/v1/logs/file`, this.formData)
            .subscribe(resp => {
              this.notificationService.success("Success", "Log data uploaded successfully!", this.apiService.getNotificationOpetions())
              this.isSpinning = false
              this.router.navigate(['/pages', 'dashboard'])
              this.formData = new FormData();
            }, error => {
              this.apiService.handleErrors(error)
              this.isSpinning = false
              this.formData = new FormData();
            });
    } else {
      this.isSpinning = false
      this.notificationService.warn("File not selected", "Please select a valid file", this.apiService.getNotificationOpetions())
    }
  }

  createApplication() {
    this.isSpinning = true
    if (this.form) {
      this.integrationService.createApplication(this.userId, {applicationName: this.form.get("name").value}).subscribe(
        resp => {
          setTimeout(_ => {this.applicationSelected(resp.applicationId);}, 50);
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
    this.integrationService.deleteApplication(this.userId, id).subscribe(
      resp => {
        this.notificationService.success('Success', 'Application successfully deleted', this.apiService.getNotificationOpetions())
        this.loadApplications(this.userId)
        window.location.reload();
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
