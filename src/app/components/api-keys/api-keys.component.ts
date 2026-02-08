import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiKeyService, ApiKey, ApiKeyResponse } from '../../services/apikey.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-api-keys',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="api-keys">
      <div class="header">
        <div>
          <h2>{{ 'apiKeys.title' | translate }}</h2>
          <p class="subtitle">{{ 'apiKeys.subtitle' | translate }}</p>
        </div>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          <span class="icon">+</span> {{ 'apiKeys.create' | translate }}
        </button>
      </div>

      <div class="info-banner">
        <span class="info-icon">ℹ️</span>
        <div>
          <strong>Current Plan: {{ currentTier }}</strong>
          <p>{{ getTierDescription() }}</p>
        </div>
        <button *ngIf="currentTier !== 'API' && currentTier !== 'TEAM'"
                class="btn btn-upgrade"
                (click)="navigateToUpgrade()">
          Upgrade to API Plan
        </button>
      </div>

      <div class="keys-list" *ngIf="apiKeys.length > 0">
        <div *ngFor="let key of apiKeys" class="key-card">
          <div class="key-header">
            <div class="key-info">
              <h3>{{ key.name }}</h3>
              <div class="key-meta">
                <span class="meta-item">
                  <span class="meta-icon">📅</span>
                  Created {{ key.createdAt | date:'short' }}
                </span>
                <span class="meta-item" *ngIf="key.lastUsedAt">
                  <span class="meta-icon">🕐</span>
                  Last used {{ key.lastUsedAt | date:'short' }}
                </span>
              </div>
            </div>
            <button class="btn-icon" (click)="confirmDelete(key)" title="{{ 'common.delete' | translate }}">
              🗑️
            </button>
          </div>
          <div class="key-stats">
            <div class="stat-row">
              <div class="stat">
                <div class="stat-label">Monthly Usage</div>
                <div class="stat-value">
                  {{ key.requestsUsed }} / {{ key.requestsPerMonth }}
                </div>
                <div class="progress-bar">
                  <div class="progress-fill"
                       [style.width.%]="(key.requestsUsed / key.requestsPerMonth) * 100"
                       [class.warning]="(key.requestsUsed / key.requestsPerMonth) > 0.8"
                       [class.danger]="(key.requestsUsed / key.requestsPerMonth) > 0.95"></div>
                </div>
              </div>
              <div class="stat-badge">
                <span class="tier-badge" [class]="'tier-' + key.tier.toLowerCase()">
                  {{ key.tier }} Tier
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="apiKeys.length === 0 && !loading">
        <div class="empty-icon">🔑</div>
        <h3>{{ 'apiKeys.empty.title' | translate }}</h3>
        <p>{{ 'apiKeys.empty.description' | translate }}</p>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          {{ 'apiKeys.create' | translate }}
        </button>
      </div>

      <!-- Create API Key Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal" (click)="closeCreateModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'apiKeys.create' | translate }}</h3>
            <button class="close-btn" (click)="closeCreateModal()">×</button>
          </div>
          <form (ngSubmit)="createApiKey()">
            <div class="form-group">
              <label>{{ 'apiKeys.name' | translate }}</label>
              <input
                type="text"
                [(ngModel)]="keyName"
                name="name"
                class="form-control"
                placeholder="Production API Key"
                required>
              <small class="form-hint">{{ 'apiKeys.nameHint' | translate }}</small>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeCreateModal()">
                {{ 'common.cancel' | translate }}
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="creating || !keyName">
                {{ creating ? ('common.creating' | translate) : ('common.create' | translate) }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Show New API Key Modal -->
      <div class="modal-overlay" *ngIf="newApiKey" (click)="newApiKey = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'apiKeys.newKey.title' | translate }}</h3>
            <button class="close-btn" (click)="newApiKey = null">×</button>
          </div>
          <div class="success-content">
            <div class="success-icon">✅</div>
            <p class="warning-text">{{ 'apiKeys.newKey.warning' | translate }}</p>
            <div class="key-display">
              <code>{{ newApiKey }}</code>
              <button class="btn-copy" (click)="copyKey(newApiKey)" title="{{ 'common.copy' | translate }}">
                📋
              </button>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" (click)="newApiKey = null">
              {{ 'common.close' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="deletingKey" (click)="deletingKey = null">
        <div class="modal modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'apiKeys.deleteConfirm' | translate }}</h3>
            <button class="close-btn" (click)="deletingKey = null">×</button>
          </div>
          <p>{{ 'apiKeys.deleteWarning' | translate }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="deletingKey = null">
              {{ 'common.cancel' | translate }}
            </button>
            <button class="btn btn-danger" (click)="deleteApiKey()" [disabled]="deleting">
              {{ deleting ? ('common.deleting' | translate) : ('common.delete' | translate) }}
            </button>
          </div>
        </div>
      </div>

      <!-- API Documentation -->
      <div class="documentation">
        <h3>{{ 'apiKeys.docs.title' | translate }}</h3>
        <p>{{ 'apiKeys.docs.intro' | translate }}</p>

        <div class="code-example">
          <div class="code-header">
            <span>{{ 'apiKeys.docs.example' | translate }}</span>
          </div>
          <pre><code>curl -X POST https://api.regexplayground.com/v1/patterns/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{{ '{' }}
    "pattern": "\\\\d{{ '{' }}3{{ '}' }}-\\\\d{{ '{' }}4{{ '}' }}",
    "testString": "Call me at 555-1234",
    "flags": "g"
  {{ '}' }}'</code></pre>
        </div>

        <div class="docs-link">
          <a href="/docs/api" target="_blank" class="btn btn-secondary">
            {{ 'apiKeys.docs.viewFull' | translate }} →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-keys {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      h2 {
        margin: 0 0 0.5rem 0;
      }

      .subtitle {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .info-banner {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.5rem;
      background: #3b82f620;
      border: 1px solid #3b82f640;
      border-radius: 8px;
      margin-bottom: 2rem;

      .info-icon {
        font-size: 1.5rem;
      }

      > div {
        flex: 1;
      }

      strong {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 1.125rem;
      }

      p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      .btn-upgrade {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        white-space: nowrap;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      }
    }

    .keys-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .key-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;

      &:hover {
        box-shadow: var(--shadow-lg);
      }
    }

    .key-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
      }
    }

    .key-meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      color: var(--text-secondary);

      .meta-icon {
        font-size: 1rem;
      }
    }

    .key-stats {
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .stat {
      flex: 1;

      .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
    }

    .stat-badge {
      .tier-badge {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;

        &.tier-free {
          background: #6b728020;
          color: #6b7280;
        }

        &.tier-pro {
          background: #3b82f620;
          color: #3b82f6;
        }

        &.tier-api {
          background: #8b5cf620;
          color: #8b5cf6;
        }

        &.tier-team {
          background: #10b98120;
          color: #10b981;
        }
      }
    }

    .progress-bar {
      height: 8px;
      background: var(--bg-secondary);
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s, background 0.3s;

        &.warning {
          background: #f59e0b;
        }

        &.danger {
          background: #ef4444;
        }
      }
    }

    .btn-icon {
      background: transparent;
      border: 1px solid var(--border-color);
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-secondary);
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }
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
      z-index: 1000;
    }

    .modal {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;

      &.modal-sm {
        max-width: 400px;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: var(--text-primary);
        }
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      .form-hint {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }

    .success-content {
      text-align: center;

      .success-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .warning-text {
        color: #f59e0b;
        font-weight: 500;
        margin-bottom: 1.5rem;
      }
    }

    .key-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-bottom: 1rem;

      code {
        flex: 1;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        word-break: break-all;
        color: var(--primary-color);
      }

      .btn-copy {
        background: transparent;
        border: 1px solid var(--border-color);
        padding: 0.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: var(--bg-tertiary);
        }
      }
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-danger {
      background: #ef4444;
      color: white;

      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }

    .documentation {
      margin-top: 3rem;
      padding-top: 3rem;
      border-top: 2px solid var(--border-color);

      h3 {
        margin-bottom: 1rem;
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .code-example {
      background: #1e1e1e;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1.5rem;

      .code-header {
        padding: 0.75rem 1rem;
        background: #2d2d2d;
        color: #ababab;
        font-size: 0.875rem;
        border-bottom: 1px solid #3d3d3d;
      }

      pre {
        margin: 0;
        padding: 1rem;
        overflow-x: auto;

        code {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #d4d4d4;
        }
      }
    }

    .docs-link {
      text-align: center;
    }

    @media (max-width: 768px) {
      .api-keys {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
      }

      .key-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class ApiKeysComponent implements OnInit {
  apiKeys: ApiKey[] = [];
  loading = false;
  creating = false;
  deleting = false;
  showCreateModal = false;
  keyName = '';
  newApiKey: string | null = null;
  deletingKey: ApiKey | null = null;
  currentTier: string = 'FREE';

  constructor(
    private apiKeyService: ApiKeyService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserTier();
    this.loadApiKeys();
  }

  loadUserTier() {
    const user = this.authService.currentUserValue;
    if (user && user.subscriptionTier) {
      this.currentTier = user.subscriptionTier;
    }
  }

  getTierDescription(): string {
    const limits: Record<string, string> = {
      'FREE': '100 API requests per month',
      'PRO': '1,000 API requests per month',
      'API': '10,000 API requests per month with webhooks support',
      'TEAM': '50,000 API requests per month with webhooks support'
    };
    return limits[this.currentTier] || 'Upgrade to access API features';
  }

  navigateToUpgrade() {
    this.router.navigate(['/pricing']);
  }

  loadApiKeys() {
    this.loading = true;
    this.apiKeyService.getApiKeys().subscribe({
      next: (keys) => {
        this.apiKeys = keys;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading API keys:', error);
        this.notificationService.error('Failed to load API keys');
        this.loading = false;
      }
    });
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.keyName = '';
  }

  createApiKey() {
    if (!this.keyName.trim()) {
      this.notificationService.warning('Please enter a name for your API key');
      return;
    }

    this.creating = true;
    this.apiKeyService.createApiKey(this.keyName).subscribe({
      next: (response: ApiKeyResponse) => {
        this.newApiKey = response.apiKey;
        this.closeCreateModal();
        this.loadApiKeys();
        this.creating = false;
      },
      error: (error) => {
        console.error('Error creating API key:', error);
        this.notificationService.error(error.error?.message || 'Failed to create API key');
        this.creating = false;
      }
    });
  }

  copyKey(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      this.notificationService.success('API key copied to clipboard');
    }).catch(() => {
      this.notificationService.error('Failed to copy API key');
    });
  }

  confirmDelete(key: ApiKey) {
    this.deletingKey = key;
  }

  deleteApiKey() {
    if (!this.deletingKey?.id) return;

    this.deleting = true;
    this.apiKeyService.deleteApiKey(this.deletingKey.id).subscribe({
      next: () => {
        this.notificationService.success('API key deleted successfully');
        this.deletingKey = null;
        this.loadApiKeys();
        this.deleting = false;
      },
      error: (error) => {
        console.error('Error deleting API key:', error);
        this.notificationService.error(error.error?.message || 'Failed to delete API key');
        this.deleting = false;
      }
    });
  }
}
