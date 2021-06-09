import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
// import { LayoutService } from '../../../@core/utils';
import {filter, map, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../auth/authentication.service";
import {TourService} from "ngx-ui-tour-md-menu";

@Component({
  selector: "'ngx-header','ngx-pages'",
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  menu = MENU_ITEMS;
  user: any;
  key: string;
  email: string;
  horizontal: boolean = true;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile', data: 'profile' }, { title: 'Log out', data: 'log_out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private router: Router,
              private breakpointService: NbMediaBreakpointsService,
              private authService: AuthenticationService, private tourService: TourService) {

              this.tourService.initialize([
                {
                anchorId: 'anchorDashboard',
                content: 'Get an overview of your system at the Dashboard. This includes the statistics of your log data, as well as top incidents within a period of time',
                enableBackdrop: true
                },
                {
                  anchorId: 'anchorLogLevels',
                  content: 'Explore the incidents happened in your system, and speed up troublehsooting!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorLogLevelDistribution',
                  content: 'Explore the incidents happened in your system, and speed up troublehsooting!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorCognitiveAnomalies',
                  content: 'Explore the incidents happened in your system, and speed up troublehsooting!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorSystemOverview',
                  content: 'Explore the incidents happened in your system, and speed up troublehsooting!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorTopIncidents',
                  content: 'Explore the incidents happened in your system, and speed up troublehsooting!',
                  enableBackdrop: true
                },
                ]);

            }
  ngOnInit() {

    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
    })

    this.currentTheme = this.themeService.currentTheme;
    this.sidebarService.collapse('menu-sidebar')

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => this.router.navigate(['/pages/profile']));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {

    this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  flow(){
    if(this.horizontal)
      return 'horizontal';
    return;
  }

}


export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Quickstart',
    icon: 'flash',
    link: '/pages/quickstart'
  },
  {
    title: 'Dashboard',
    icon: 'grid-outline',
    link: '/pages/dashboard',
    home: true
  },
  {
    title: 'Incidents',
    icon: 'radio-button-on-outline',
    link: '/pages/incidents',
  },
  {
    title: 'Variable analysis',
    icon: 'bar-chart',
    link: '/pages/variable-analysis',
  },
  {
    title: 'Send logs',
    icon: 'link-outline',
    link: '/pages/integration',
  }
]
