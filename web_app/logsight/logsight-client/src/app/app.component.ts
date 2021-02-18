/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet> <simple-notifications [options]="notificationOptions"></simple-notifications>',
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
  }

  ngOnInit(): void {
    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContextItemSelection(event.item.data);
      });
  }

  onContextItemSelection(data) {
    if (data === 'log_out') {
      localStorage.setItem('key', null)
      this.router.navigate(['/auth/login']);
    }
  }
}
