import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthComponent } from './components/auth/auth.component';
import { AuthService } from './services/auth.service';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AuthComponent, TranslateModule, LanguageSwitcherComponent],
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
                Tester
              </a>
              <a routerLink="/library" routerLinkActive="active">
                Library
              </a>
              <a routerLink="/pricing" routerLinkActive="active">
                Pricing
              </a>
              <a routerLink="/contact" routerLinkActive="active">
                Contact
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
          <p>© 2025 Regex Playground. Built with ❤️ for developers.</p>
          <div class="footer-links">
            <a routerLink="/contact">Contact</a>
            <a href="https://github.com/rgual27" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://x.com/RGBCuba" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="https://www.linkedin.com/in/rafael-gual-borges-a0ab03128/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>

    <app-auth></app-auth>
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

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
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
