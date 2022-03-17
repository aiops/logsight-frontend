import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
// import { LayoutService } from '../../../@core/utils';
import {filter, map, takeUntil} from 'rxjs/operators';
import {interval, Subject} from 'rxjs';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../auth/authentication.service";
import {TourService} from "ngx-ui-tour-md-menu";
import {ApiService} from "../../../@core/service/api.service";

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
  id: string;
  email: string;
  userId: string;
  progressValue: number;
  curSec: number;
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
              private authService: AuthenticationService,
              private tourService: TourService,
              private apiService: ApiService,) {

              this.tourService.initialize([
                {
                anchorId: 'anchorDashboard',
                content: 'Wait for the data to load.. It may take up to a minute. \n\n The Dashboard shows an overview of your system. This includes overview of the observed services, the statistics of their log data, as well as top incidents within a period of time.',
                enableBackdrop: true,
                route: '/pages/dashboard'
                },
                {
                  anchorId: 'anchorLogLevels',
                  content: 'The log messages contain an important information about their log level. Here you can observe the counts between error and normal logs. Increased error counts may suggest anomalous behaviour.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorCognitiveAnomalies',
                  content: 'This summarizes the deep learning anomaly detection method, which analyzes the semantics of each log message to detect abnormalities. High number of threat messages may indicate a failure!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorSystemOverview',
                  content: 'Get an overview of the system! Clicking on a red box will redirect you to a detailed view of the period! Green color represents normal state.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorTopIncidents',
                  content: 'Here you can see the top most severe incidents in the last 24 hours. Clicking on ' +
                    'View Details will show you details of the incident!\n\n For example, the most severe incident detected is from the Resource Manager service. \n\n When multiple threads call the function almost simultaneously, the arguments will be out or order since it was not thread-safe. This needs to be fixed by making it thread-safe.\n' +
                    '--> [hadoop] MAPREDUCE-3531 Report | Version 0.23.1',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorIncidentsTab',
                  content: 'In this view, the details of the selected incident are shown! Clicking on View Details will show you the details of the incident!',
                  enableBackdrop: true,
                  route: '/pages/incidents'
                },
                {
                  anchorId: 'compareExplanation',
                  content: 'In this tab, you can compare logs and verify deployments.',
                  enableBackdrop: true,
                  route: '/pages/compare'
                }
                ,
                {
                  anchorId: 'compareVerify',
                  content: 'Select your application, select the tags, and click on Verify to see the results!',
                  enableBackdrop: true,
                },
                {
                  anchorId: 'profile',
                  content: 'In this tab, you can manage your user and applications.',
                  enableBackdrop: true,
                  route: '/pages/profile'
                }

                ]);

            }
  ngOnInit() {
    this.themeService.changeTheme("default")
    this.curSec = 0;
    this.userId = localStorage.getItem('userId')
    this.authService.getLoggedUser(this.userId).subscribe(user => {
      // console.log(user)
      this.id = user.userId
      this.email = user.email
    })

    // this.apiService.post("/api/v1/external/kibana/login", {}).subscribe(data =>{
    // })

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


  // startTimer(seconds: number) {
  //   const time = seconds;
  //   const timer$ = interval(1000);
  //   const sub = timer$.subscribe((sec) => {
  //     this.progressValue = Number((sec * 100 / seconds).toPrecision(1));
  //     this.curSec = sec;
  //     if (this.curSec === seconds) {
  //       sub.unsubscribe();
  //       this.router.navigate(['/pages/kibana'])
  //     }
  //   });
  // }

  // loginKibana(){
  //   this.apiService.post("/api/auth/kibana/login",
  //     '{"password":"test-test","username":'+this.key+ '}').subscribe(data =>{
  //   })
  // }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  flow(){
    if(this.horizontal)
      return 'horizontal';
    return;
  }

    startTutorial(){
    this.tourService.start()
  }

}


export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Send Logs',
    icon: 'flash',
    link: '/pages/send-logs'
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
    link: '/pages/file-upload',
  }
]
