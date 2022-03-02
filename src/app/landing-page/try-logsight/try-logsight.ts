import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {LogFileType} from "../../@core/common/log-file-type";
import {ApiService} from "../../@core/service/api.service";
import {UserLoginFormId} from "../../@core/common/auth/userLoginFormId";
import {Observable} from "rxjs";


@Component({
  selector: 'try-logsight',
  templateUrl: './try-logisght.html',
  styleUrls: ['../assets/css/style.css', 'try-logsight.scss',
    '../assets/vendor/aos/aos.css', '../assets/vendor/remixicon/remixicon.css',
    '../assets/vendor/bootstrap-icons/bootstrap-icons.css',
    '../assets/vendor/swiper/swiper-bundle.min.css', '../assets/vendor/glightbox/css/glightbox.css'],
})
export class TryLogsightComponent implements OnInit {

  logFileType: String;
  logFileTypes: LogFileType[] = [];
  uploadFile = false;
  fileName = '';
  fileList = [];
  isSpinning = false;
  fileNotUploaded: Boolean = true;
  public formData = new FormData();
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('demo')
  });
  formLogFileType = new FormGroup({logTypeControl: new FormControl('Choose')})
  message = '';
  kibanaUrl = '';
  emailCheck = false;
  loginForm: UserLoginFormId = {
          id: 0,
          password: ""
        }
  ReqJson: any = {};
  fileToUpload: File | null = null;

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.loadLogFileTypes()
    if (this.formLogFileType != null){
      this.formLogFileType?.get("logTypeControl").valueChanges.subscribe(value => {
        this.logFileType = value
    })
    }


  }

  loadLogFileTypes() {
    this.loadFileTypes().subscribe(resp =>{
      this.logFileTypes = resp
    }, error => {
      console.log(status)
      // if (error.status)
      localStorage.removeItem("token")
      this.loadFileTypes()
      location.reload()
      }
    )
  }

  loadFileTypes(): Observable<LogFileType[]> {
    return this.apiService.get(`/api/applications/logFileFormats`)
  }


  uploadFiles(file) {
    this.formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      this.formData.append("file", file[i], file[i]['name']);
      this.fileList.push(file[i]['name'])
    }
    this.notificationService.success("File attached successfully!")
  }


  onGetInsights() {

    if (this.fileList.length > 0 && this.logFileType != null && this.form.value.email.length > 0){


    this.isSpinning = true;
    this.apiService.post(`/api/fast_try/${this.form.value.email}/${this.logFileType}/upload`, this.formData)
      .subscribe(resp => {
        this.notificationService.success("Log data uploaded successfully!")
        // this.loginForm.password = resp.password
        this.loginForm.id = resp.id
        this.kibanaUrl = resp.kibanaPersonalUrl
        this.apiService.post("/api/auth/kibana/login",
          '{"key":"'+ resp.key + '"}').subscribe(data =>{
        })
        this.isSpinning = false;
        this.emailCheck = true;
        // this.authService.loginId(this.loginForm).subscribe(user => {
        //   this.isSpinning = false;
        //   this.emailCheck = true;
        // }, err => {
        //   this.notificationService.error('Error', 'Incorrect or not activated email')
        // });
        // this.isSpinning = false;
        //   this.emailCheck = true;
      }, error => {
        this.notificationService.error("Error: ", "Please ensure that your log file corresponds to the selected log type!")
      });

    this.formData = new FormData();
    this.ReqJson = {};
     }else{
      this.notificationService.error("Please check the mandatory fields! Select log file type, log file, and email address!")
    }
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

}
