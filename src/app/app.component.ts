import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthComponent } from './components/auth/auth.component';
import { AuthService } from './services/auth.service';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ModalComponent } from './components/modal/modal.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AuthComponent, TranslateModule, LanguageSwitcherComponent, NotificationComponent, ModalComponent],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="container">
          <nav class="nav">
            <div class="logo">
              <h1>🔍 Regex Playground</h1>
            </div>
            <div class="nav-links">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                {{ 'nav.tester' | translate }}
              </a>
              <a routerLink="/examples" routerLinkActive="active">
                📚 Examples
              </a>
              <a routerLink="/challenges" routerLinkActive="active">
                🏆 Challenges
              </a>
              <a routerLink="/cheat-sheet" routerLinkActive="active">
                📖 Cheat Sheet
              </a>
              <a routerLink="/library" routerLinkActive="active">
                {{ 'nav.library' | translate }}
              </a>
              <div class="dropdown" *ngIf="(currentUser$ | async) && userTier === 'PRO'">
                <button class="dropdown-toggle" (click)="toggleFeaturesMenu()">
                  {{ 'nav.features' | translate }} ▾
                </button>
                <div class="dropdown-menu" *ngIf="showFeaturesMenu">
                  <a routerLink="/folders" routerLinkActive="active">
                    📁 {{ 'nav.folders' | translate }}
                  </a>
                </div>
              </div>
              <a routerLink="/pricing" routerLinkActive="active">
                {{ 'nav.pricing' | translate }}
              </a>
              <a routerLink="/contact" routerLinkActive="active">
                {{ 'nav.contact' | translate }}
              </a>
            </div>
            <div class="nav-actions">
              <app-language-switcher></app-language-switcher>
              <ng-container *ngIf="currentUser$ | async as user; else guestMenu">
                <a routerLink="/account" class="btn btn-secondary">{{ 'nav.myAccount' | translate }}</a>
                <button class="btn btn-secondary" (click)="logout()">{{ 'nav.logout' | translate }}</button>
              </ng-container>
              <ng-template #guestMenu>
                <button class="btn btn-secondary" (click)="openLogin()">{{ 'nav.login' | translate }}</button>
                <button class="btn btn-primary" (click)="openSignUp()">{{ 'nav.signup' | translate }}</button>
              </ng-template>
            </div>
          </nav>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="container">
          <p>{{ 'footer.copyright' | translate }}</p>
          <div class="footer-links">
            <a routerLink="/contact">{{ 'nav.contact' | translate }}</a>
            <a href="https://github.com/rgual27" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://x.com/RGBCuba" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="https://www.linkedin.com/in/rafael-gual-borges-a0ab03128/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>

    <app-auth></app-auth>
    <app-notification></app-notification>
    <app-modal></app-modal>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background-color: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow-sm);
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
    }

    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
      color: var(--primary-color);
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }

    .nav-links a {
      color: #334155;
      font-weight: 600;
      padding: 0.5rem 0;
      border-bottom: 2px solid transparent;
      transition: transform 0.2s, opacity 0.2s;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #1E40AF;
      border-bottom: 2px solid #3B82F6;
      transform: translateY(-1px);
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      background: none;
      border: none;
      color: #334155;
      font-weight: 600;
      padding: 0.5rem 0;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      font-size: 1rem;

      &:hover {
        color: #1E40AF;
      }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      margin-top: 0.5rem;
      min-width: 180px;
      z-index: 1001;
      animation: fadeIn 0.2s ease-out;

      a {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--text-primary);
        font-weight: 500;
        border-bottom: none !important;
        transition: background 0.2s;

        &:hover {
          background: var(--bg-secondary);
          transform: none !important;
        }

        &:first-child {
          border-radius: 8px 8px 0 0;
        }

        &:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .user-info {
      color: var(--text-primary);
      font-weight: 600;
      padding: 0.5rem 1rem;
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
    }

    .footer {
      background-color: var(--bg-primary);
      border-top: 1px solid var(--border-color);
      padding: 2rem 0;
      margin-top: auto;
      height: 120px;
      flex-shrink: 0;
    }

    .footer .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .footer-links {
      display: flex;
      gap: 2rem;
    }

    .footer-links a {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .nav {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        justify-content: flex-start;
        width: 100%;
      }

      .nav-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .footer .container {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild(AuthComponent) authComponent!: AuthComponent;
  currentUser$;
  showFeaturesMenu = false;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  get userTier(): string {
    return this.authService.currentUserValue?.subscriptionTier || 'FREE';
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);

    // Close features menu on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showFeaturesMenu = false;
    });
  }

  toggleFeaturesMenu(): void {
    this.showFeaturesMenu = !this.showFeaturesMenu;
  }

  openLogin(): void {
    this.authComponent.open('login');
  }

  openSignUp(): void {
    this.authComponent.open('register');
  }

  logout(): void {
    this.authService.logout();
  }
}
