/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from "rxjs/operators";

declare const gtag: Function;
@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet><simple-notifications [options]="notificationOptions"></simple-notifications>',
})
export class AppComponent implements OnInit {

  notificationOptions = {
    position: ['bottom', 'right'],
    timeOut: 2000,
    lastOnBottom: true,
    pauseOnHover: true,
    showProgressBar: true,
    clickToClose: true
  };

  constructor(private menuService: NbMenuService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      /** START : Code to Track Page View  */
       gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
       })
      /** END */
    })
  }

  ngOnInit(): void {
    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContextItemSelection(event.item.data);
      });

  }

  onContextItemSelection(data) {
    if (data === 'log_out') {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('user')
      localStorage.removeItem('selectedTime')
      setTimeout(_ => location.reload(), 300)
    }
  }
}
