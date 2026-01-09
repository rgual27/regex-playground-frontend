import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/regex-tester/regex-tester.component')
      .then(m => m.RegexTesterComponent)
  },
  {
    path: 'library',
    loadComponent: () => import('./components/pattern-library/pattern-library.component')
      .then(m => m.PatternLibraryComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./components/pricing/pricing.component')
      .then(m => m.PricingComponent)
  },
  {
    path: 'account',
    loadComponent: () => import('./components/account/account.component')
      .then(m => m.AccountComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component')
      .then(m => m.ContactComponent)
  },
  {
    path: 'folders',
    loadComponent: () => import('./components/folder-manager/folder-manager.component')
      .then(m => m.FolderManagerComponent)
  },
  {
    path: 'teams',
    loadComponent: () => import('./components/team-manager/team-manager.component')
      .then(m => m.TeamManagerComponent)
  },
  {
    path: 'api-keys',
    loadComponent: () => import('./components/api-keys/api-keys.component')
      .then(m => m.ApiKeysComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
