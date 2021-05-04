import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogsightUser } from '../../@core/common/logsight-user';
import {AuthenticationService} from "../../auth/authentication.service";

@Component({
  selector: 'profile',
  styleUrls: ['./profile.page.scss'],
  templateUrl: './profile.page.html',
})
export class ProfilePage implements OnInit {

  key: string
  email: string

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
    })
  }
}
