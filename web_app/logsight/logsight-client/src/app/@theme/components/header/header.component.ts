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
                enableBackdrop: true,
                  route: '/pages/dashboard'
                },
                {
                  anchorId: 'anchorLogLevels',
                  content: 'Observe the ratio between error and normal logs.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorLogLevelDistribution',
                  content: 'Here you see it through time. If you notice any strange changes, it might be an indication of anomaly!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorCognitiveAnomalies',
                  content: 'This summarizes one of our deep learning anomaly detection methods. High number of anomalous messages may indicate a failure!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorSystemOverview',
                  content: 'Get an overview of the system! Clicking on a red box will redirect you to a detailed view of the period!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorTopIncidents',
                  content: 'Here you can see the top 5 most severe incidents in the last 24 hours. Clicking on ' +
                    'View Details will show you details of the incident!',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorIncidentsTab',
                  content: 'In this tab, all of the incidents are shown with their description!',
                  enableBackdrop: true,
                  route: '/pages/incidents'
                },
                {
                  anchorId: 'anchorCriticalAnomalies',
                  content: 'Critical anomalies are most severe. It means that they are deviating from the normal ratio ' +
                    '(or new log messages) and are recognized as cognitive anomalies by our deep network.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorFlowAnomalies',
                  content: 'Flow anomalies are those logs that deviate from the normal flow of the system. For example, ' +
                    'consider that log statements A and B are always appearing together in a time interval. ' +
                    'If this ratio is broken then we report a flow anomaly.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorCogAnomalies',
                  content: 'Cognitive anomalies are those that have negative semantic meaning. It is very similar to what an experienced developer would detect.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorNewAnomalies',
                  content: 'These log types are detected as novel and not seen before. This might happen when there is abnormal system behavior, or simply a new update of the application.',
                  enableBackdrop: true
                },
                {
                  anchorId: 'anchorParsing',
                  content: 'We not only analyze the log messages as log types, logsight.ai automatically structures the logs extracting useful information in terms of log variables.',
                  enableBackdrop: true,
                    route: '/pages/variable-analysis'
                },
                {
                  anchorId: 'anchorTopTemplates',
                  content: 'We cluster the log types together and detect if large deviations in log count if they happen.',
                  enableBackdrop: true,
                },
                {
                  anchorId: 'anchorLogs',
                  content: 'Feel free to fully explore your logs, empowered by our automatic log parsing. After the tutorial, try and click on some highlighted word!',
                  enableBackdrop: true,
                },
                {
                  anchorId: 'anchorApplications',
                  content: 'Finally, here you can manage your applications. We offer creation of new applications, deletion, and of course easy steps for integration. Start sending data in less than 5 minutes !',
                  enableBackdrop: true,
                  route: '/pages/integration'
                }
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
