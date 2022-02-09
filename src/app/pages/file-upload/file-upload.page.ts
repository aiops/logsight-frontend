import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {Application} from '../../@core/common/application';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'file-upload',
  styleUrls: ['./file-upload.page.scss'],
  templateUrl: './file-upload.page.html',
})
export class FileUploadPage implements OnInit {
  email: string;

  applicationId: string;
  isSpinning = false;
  applications: Application[] = [];
  applicationName: string;
  public show: boolean = false;
  public uploadFile: boolean = true;
  public formData = new FormData();

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private apiService: ApiService) {
  }

  ngOnInit(): void {
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
      this.applicationName = this.getAppName(file[i]['name'])
    }
    this.notificationService.success("Click the upload button to send the log file.")
  }

  getAppName(appName: string) {
    return appName.replace(/\W/g, '').replace(/\.[^/.]+$/, "")
  }

  requestUpload() {
    this.isSpinning = true
    if (this.applicationName) {
      this.integrationService.createApplication({"applicationName": this.applicationName}).subscribe(
        application => {
          console.log(application)
          let fileForm = {"applicationId": application.applicationId, "file": this.formData.get("file")}
          this.http.post(`/api/v1/logs/file`, fileForm)
            .subscribe(resp => {
              this.notificationService.success("Log data uploaded successfully!")
              this.isSpinning = false
              this.router.navigate(['/pages', 'dashboard'])
            }, error => {
              this.apiService.handleErrors(error)
            });
          this.formData = new FormData();
        }
      )
    } else {
      this.notificationService.warn("Please select file.")
    }
  }

  loadApplications() {
    this.integrationService.loadApplications().subscribe(resp => this.applications = resp.applications)
  }

}
