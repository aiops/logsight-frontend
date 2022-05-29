import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
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
    title: 'File upload',
    icon: 'link-outline',
    link: '/pages/file-upload',
  },
  {
    title: 'Sample data',
    icon: 'link-outline',
    link: '/pages/sample-data',
  },
  {
    title: 'Profile',
    icon: '',
    link: '/pages/profile',
  }
];
