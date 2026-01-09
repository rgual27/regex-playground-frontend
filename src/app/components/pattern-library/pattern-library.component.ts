import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatternService, RegexPattern } from '../../services/pattern.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pattern-library',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="container">
      <div class="library-header">
        <div>
          <h1>{{ 'library.title' | translate }}</h1>
          <p>{{ 'library.subtitle' | translate }}</p>
        </div>
        <button class="btn btn-primary">+ {{ 'library.newPattern' | translate }}</button>
      </div>

      <div class="upgrade-banner" *ngIf="isAuthenticated && userTier === 'FREE' && patterns.length >= 5">
        <div class="banner-content">
          <h3>🔒 {{ 'library.limitReached' | translate }}</h3>
          <p>{{ 'library.limitMessage' | translate }}</p>
        </div>
        <button class="btn btn-primary" routerLink="/pricing">{{ 'library.upgradeButton' | translate }}</button>
      </div>

      <div class="library-empty" *ngIf="!isAuthenticated">
        <div class="empty-state">
          <div class="empty-icon">🔐</div>
          <h3>{{ 'library.loginTitle' | translate }}</h3>
          <p>{{ 'library.loginMessage' | translate }}</p>
        </div>
      </div>

      <div class="library-empty" *ngIf="isAuthenticated && patterns.length === 0 && !loading">
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>{{ 'library.emptyTitle' | translate }}</h3>
          <p>{{ 'library.emptyMessage' | translate }}</p>
          <button class="btn btn-primary" routerLink="/">{{ 'library.goToTester' | translate }}</button>
        </div>
      </div>

      <div class="patterns-grid" *ngIf="isAuthenticated && patterns.length > 0">
        <div class="pattern-card" *ngFor="let pattern of patterns">
          <div class="pattern-header">
            <h3>{{ pattern.name }}</h3>
            <div class="pattern-actions">
              <button class="btn-icon" (click)="deletePattern(pattern.id!)" [title]="'library.delete' | translate">🗑️</button>
            </div>
          </div>
          <div class="pattern-content">
            <code class="pattern-code">/{{ pattern.pattern }}/{{ pattern.flags || '' }}</code>
            <p class="pattern-description" *ngIf="pattern.description">{{ pattern.description }}</p>
          </div>
          <div class="pattern-footer">
            <span class="pattern-date">{{ formatDate(pattern.updatedAt) }}</span>
            <button class="btn btn-sm btn-secondary" routerLink="/">{{ 'library.loadInTester' | translate }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .library-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-secondary);
      }
    }

    .upgrade-banner {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        opacity: 0.9;
      }

      button {
        background-color: white;
        color: var(--primary-color);
        white-space: nowrap;

        &:hover {
          background-color: var(--bg-tertiary);
        }
      }
    }

    .library-empty {
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      max-width: 400px;

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .library-header {
        flex-direction: column;
        gap: 1rem;

        button {
          width: 100%;
        }
      }

      .upgrade-banner {
        flex-direction: column;
        text-align: center;
        gap: 1rem;

        button {
          width: 100%;
        }
      }
    }

    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .pattern-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: all 0.2s;

      &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }
    }

    .pattern-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      h3 {
        font-size: 1.25rem;
        margin: 0;
        color: var(--text-primary);
      }
    }

    .pattern-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.25rem;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    .pattern-content {
      margin-bottom: 1rem;
    }

    .pattern-code {
      display: block;
      background-color: var(--bg-secondary);
      padding: 0.75rem;
      border-radius: 0.375rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      word-break: break-all;
      margin-bottom: 0.5rem;
    }

    .pattern-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    .pattern-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .pattern-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
  `]
})
export class PatternLibraryComponent implements OnInit {
  patterns: RegexPattern[] = [];
  loading = false;

  constructor(
    private patternService: PatternService,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get userTier(): string {
    return this.authService.currentUserValue?.subscriptionTier || 'FREE';
  }

  ngOnInit() {
    if (this.isAuthenticated) {
      this.loadPatterns();
    }
  }

  loadPatterns() {
    this.loading = true;
    this.patternService.getMyPatterns().subscribe({
      next: (patterns) => {
        this.patterns = patterns;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patterns:', error);
        this.loading = false;
      }
    });
  }

  deletePattern(id: number) {
    if (!confirm('Are you sure you want to delete this pattern?')) {
      return;
    }

    this.patternService.deletePattern(id).subscribe({
      next: () => {
        this.patterns = this.patterns.filter(p => p.id !== id);
      },
      error: (error) => {
        console.error('Error deleting pattern:', error);
        alert('Failed to delete pattern. Please try again.');
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }
}
