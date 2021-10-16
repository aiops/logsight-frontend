import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {LogFileType} from "../../@core/common/log-file-type";


@Component({
  selector: 'try-logsight',
  templateUrl: './try-logisght.html',
  styleUrls: ['../assets/css/style.css','../../pages/integration/integration.page.scss', 'try-logsight.scss',
    '../assets/vendor/aos/aos.css', '../assets/vendor/remixicon/remixicon.css',
    '../assets/vendor/bootstrap-icons/bootstrap-icons.css',
    '../assets/vendor/swiper/swiper-bundle.min.css', '../assets/vendor/glightbox/css/glightbox.css'],
})
export class TryLogsightComponent implements OnInit {

  logFileType: String;
  logFileTypes: LogFileType[] = [];
  public uploadBtn: any = 'Upload file';
  public uploadFile: boolean = false;
  code_upload = ''
  fileName = '';
  fileNotUploaded: Boolean = true;
  public formData = new FormData();
  ReqJson: any = {};
  fileToUpload: File | null = null;

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router,
              fb: FormBuilder, private http:HttpClient) {
  }

  ngOnInit(): void {
    this.code_upload = this.getCodeUpload()
  }

  logFileTypeSelected(logFileType: string) {
    logFileType === "" ? this.logFileType = null : this.logFileType = logFileType;
  }

  uploadFiles(file) {
    this.formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      this.formData.append("file", file[i], file[i]['name']);
    }
    this.notificationService.success("Click the upload button to send the log file.")
  }

  // fileUpload(files: FileList){
  //   this.fileToUpload = files.item(0);
  // }

  RequestUpload() {
    // this.http.post(`/api/applications/${this.applicationId}/uploadFile/${this.logFileType}`, this.formData)
    //   .subscribe(resp => {
    //     this.notificationService.success("Log data uploaded successfully!")
    //   }, error => {
    //     this.notificationService.error("Error: ", error.error.detail)
    //   });
    // this.formData = new FormData();
    // this.ReqJson = {};
    // this.router.navigate(['/pages', 'dashboard'])
  }

  ngAfterViewInit() {
   window.scrollTo(0, 0);
  }

  @HostListener('input') oninput() {

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 0) {
      let element = document.getElementById('navbar');
      element.classList.add('sticky');
    } else {
      let element = document.getElementById('navbar');
      element.classList.remove('sticky');
    }
  }
  onUploadBtn() {
    this.uploadFile = true
  }

  private getCodeUpload(){
    return `
    1. JSON - native files should contain the following structure.
    {
    "logMessages": [
      {
        "private-key": "", //$ {this.key}
        "app": "string",
        "timestamp": "string",
        "level": "string",
        "message": "string"
      }
    ]
    }
    }

    2. JSON - logstash.
    We currently support all file outputs from logstash

    3. syslog - We support log files that follow the syslog format.
    You can upload logs located in /var/log/syslog.
    `
  }
}
