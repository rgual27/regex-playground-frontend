import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/regex-tester/regex-tester.component')
      .then(m => m.RegexTesterComponent)
  },
  {
    path: 'examples',
    loadComponent: () => import('./components/examples/examples.component')
      .then(m => m.ExamplesComponent)
  },
  {
    path: 'challenges',
    loadComponent: () => import('./components/challenges/challenges.component')
      .then(m => m.ChallengesComponent)
  },
  {
    path: 'cheat-sheet',
    loadComponent: () => import('./components/cheat-sheet/cheat-sheet.component')
      .then(m => m.CheatSheetComponent)
  },
  {
    path: 'r/:shareCode',
    loadComponent: () => import('./components/shared-pattern/shared-pattern.component')
      .then(m => m.SharedPatternComponent)
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
    path: 'teams/join/:token',
    loadComponent: () => import('./components/team-manager/team-manager.component')
      .then(m => m.TeamManagerComponent)
  },
  {
    path: 'api-keys',
    loadComponent: () => import('./components/api-keys/api-keys.component')
      .then(m => m.ApiKeysComponent)
  },
  {
    path: 'community',
    loadComponent: () => import('./components/community/community.component')
      .then(m => m.CommunityComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./components/leaderboard/leaderboard.component')
      .then(m => m.LeaderboardComponent)
  },
  {
    path: 'users/:username',
    loadComponent: () => import('./components/user-profile/user-profile.component')
      .then(m => m.UserProfileComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog.component')
      .then(m => m.BlogComponent)
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./components/blog/blog-post.component')
      .then(m => m.BlogPostComponent)
  },
  {
    path: 'regex-of-the-day',
    loadComponent: () => import('./components/regex-of-the-day/regex-of-the-day.component')
      .then(m => m.RegexOfTheDayComponent)
  },
  {
    path: 'regex-of-the-day/archive',
    loadComponent: () => import('./components/regex-of-the-day/regex-of-the-day-archive.component')
      .then(m => m.RegexOfTheDayArchiveComponent)
  },
  {
    path: 'embed',
    loadComponent: () => import('./components/embed/embed-generator.component')
      .then(m => m.EmbedGeneratorComponent)
  },
  {
    path: 'embed/tester',
    loadComponent: () => import('./components/embed/embed-tester.component')
      .then(m => m.EmbedTesterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
