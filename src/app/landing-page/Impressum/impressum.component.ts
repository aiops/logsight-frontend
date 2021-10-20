import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectionService } from './connectionService';

@Component({
  selector: 'impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['../assets/css/style.css',
    '../assets/vendor/aos/aos.css', '../assets/vendor/remixicon/remixicon.css',
    '../assets/vendor/bootstrap-icons/bootstrap-icons.css',
    '../assets/vendor/swiper/swiper-bundle.min.css', '../assets/vendor/glightbox/css/glightbox.css'],
})
export class ImpressumComponent implements OnInit {

  //DELETE EVERYTHING HERE IF NOT USED ON THE PAGE
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('demo')
  });
  contactForm: FormGroup;
  disabledSubmitButton: boolean = true;
  optionsSelect: Array<any>;

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router,
              fb: FormBuilder,
              private connectionService: ConnectionService) {
    this.contactForm = fb.group({
      'contactFormSubject': ['', Validators.required],
      'contactFormEmail': ['', Validators.compose([Validators.required, Validators.email])],
      'contactFormSubjects': ['', Validators.required],
      'contactFormMessage': ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }

    this.optionsSelect = [
      { value: 'Feedback', label: 'Feedback' },
      { value: 'Report a bug', label: 'Report a bug' },
      { value: 'Feature request', label: 'Feature request' },
      { value: 'Other stuff', label: 'Other stuff' },
    ];
  }

  ngAfterViewInit() {
   window.scrollTo(0, 0);
  }

  @HostListener('input') oninput() {

    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
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

  onLogin() {
    this.authService.login(this.form.value).subscribe(resp => {
        this.router.navigate(['/pages/quickstart'])
      }, err => {

        this.notificationService.error('Error', 'Incorrect email or password')
      }
    )
  }

  get name() {
    return this.contactForm.get('contactFormSubject');
  }

  get email() {
    return this.contactForm.get('contactFormEmail');
  }

  get subjects() {
    return this.contactForm.get('contactFormSubjects');
  }

  get message() {
    return this.contactForm.get('contactFormMessage');
  }

  get copy() {
    return this.contactForm.get('contactFormCopy');
  }

  onSubmit() {
    this.connectionService.sendMessage(this.contactForm.value).subscribe(() => {
      alert('Your message has been sent.');
      this.contactForm.reset();
      this.disabledSubmitButton = true;
    }, (error: any) => {

    });
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login'])
  }

  redirectToHomepage() {
    this.router.navigate([''])
  }

  redirectToTermsAndConditions() {
    this.router.navigate(['terms-conditions'])
  }

  redirectToPrivacyAndPolicy() {
    this.router.navigate(['privacy-policy'])
  }
}
