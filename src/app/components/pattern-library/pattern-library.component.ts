import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatternService, RegexPattern } from '../../services/pattern.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pattern-library',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, FormsModule],
  template: `
    <div class="container">
      <div class="library-header">
        <div>
          <h1>{{ 'library.title' | translate }}</h1>
          <p>{{ 'library.subtitle' | translate }}</p>
        </div>
        <button class="btn btn-primary" (click)="openNewPatternModal()">+ {{ 'library.newPattern' | translate }}</button>
      </div>

      <!-- New Pattern Modal -->
      <div class="modal-overlay" *ngIf="showNewPatternModal" (click)="closeNewPatternModal()">
        <div class="modal-content new-pattern-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'library.newPattern' | translate }}</h3>
            <button class="modal-close" (click)="closeNewPatternModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="createPattern()">
              <div class="form-group">
                <label for="patternName">{{ 'library.patternName' | translate }}</label>
                <input
                  type="text"
                  id="patternName"
                  [(ngModel)]="newPattern.name"
                  name="patternName"
                  [placeholder]="'library.patternNamePlaceholder' | translate"
                  required>
              </div>

              <div class="form-group">
                <label for="pattern">{{ 'common.regex' | translate }}</label>
                <input
                  type="text"
                  id="pattern"
                  [(ngModel)]="newPattern.pattern"
                  name="pattern"
                  [placeholder]="'common.enterPattern' | translate"
                  required>
              </div>

              <div class="form-group">
                <label for="flags">{{ 'library.flags' | translate }}</label>
                <input
                  type="text"
                  id="flags"
                  [(ngModel)]="newPattern.flags"
                  name="flags"
                  placeholder="gim"
                  maxlength="10">
              </div>

              <div class="form-group">
                <label for="description">{{ 'library.description' | translate }}</label>
                <textarea
                  id="description"
                  [(ngModel)]="newPattern.description"
                  name="description"
                  [placeholder]="'library.descriptionPlaceholder' | translate"
                  rows="3"></textarea>
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    [(ngModel)]="newPattern.isPublic"
                    name="isPublic">
                  <span>{{ 'library.makePublic' | translate }}</span>
                </label>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeNewPatternModal()">
                  {{ 'common.cancel' | translate }}
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!newPattern.name || !newPattern.pattern">
                  {{ 'common.save' | translate }}
                </button>
              </div>
            </form>
          </div>
        </div>
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
            <button class="btn btn-sm btn-secondary" (click)="loadInTester(pattern)">{{ 'library.loadInTester' | translate }}</button>
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

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
      backdrop-filter: blur(4px);
    }

    .new-pattern-modal {
      max-width: 600px;
      width: 90%;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      input, textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 15px;
        font-family: inherit;
        transition: all 0.2s;
        background: var(--bg-secondary);
        color: var(--text-primary);

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          background: var(--bg-primary);
        }
      }

      textarea {
        resize: vertical;
      }
    }

    .checkbox-group {
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        input[type="checkbox"] {
          width: auto;
        }
      }
    }
  `]
})
export class PatternLibraryComponent implements OnInit {
  patterns: RegexPattern[] = [];
  loading = false;
  showNewPatternModal = false;
  newPattern: RegexPattern = {
    name: '',
    pattern: '',
    description: '',
    flags: '',
    isPublic: false
  };

  constructor(
    private patternService: PatternService,
    private authService: AuthService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private router: Router
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

  async deletePattern(id: number) {
    const confirmed = await this.modalService.confirm(
      'Delete Pattern',
      'Are you sure you want to delete this pattern? This action cannot be undone.',
      'Delete',
      'Cancel'
    );

    if (!confirmed) {
      return;
    }

    this.patternService.deletePattern(id).subscribe({
      next: () => {
        this.patterns = this.patterns.filter(p => p.id !== id);
        this.notificationService.success('Pattern deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting pattern:', error);
        this.notificationService.error('Failed to delete pattern. Please try again.');
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  openNewPatternModal() {
    if (!this.isAuthenticated) {
      this.notificationService.warning('Please login to create patterns');
      return;
    }

    if (this.userTier === 'FREE' && this.patterns.length >= 5) {
      this.notificationService.warning('You have reached the free plan limit. Upgrade to Pro for unlimited patterns!');
      return;
    }

    this.showNewPatternModal = true;
  }

  closeNewPatternModal() {
    this.showNewPatternModal = false;
    this.resetNewPattern();
  }

  resetNewPattern() {
    this.newPattern = {
      name: '',
      pattern: '',
      description: '',
      flags: '',
      isPublic: false
    };
  }

  createPattern() {
    if (!this.newPattern.name || !this.newPattern.pattern) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    this.patternService.savePattern(this.newPattern).subscribe({
      next: (pattern) => {
        this.notificationService.success('Pattern created successfully!');
        this.patterns.unshift(pattern as any); // Add to beginning of list
        this.closeNewPatternModal();
      },
      error: (error) => {
        console.error('Error creating pattern:', error);
        this.notificationService.error(error.error?.message || 'Failed to create pattern. Please try again.');
      }
    });
  }

  loadInTester(pattern: RegexPattern) {
    this.patternService.loadPatternIntoTester(pattern);
    this.router.navigate(['/']);
  }
}
