import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="container">
      <div class="account-header">
        <h1>{{ 'account.title' | translate }}</h1>
        <p>{{ 'account.subtitle' | translate }}</p>
      </div>

      <div class="account-grid">
        <!-- User Information -->
        <div class="card account-info">
          <h2>👤 {{ 'account.profile.title' | translate }}</h2>
          <div class="info-row" *ngIf="user">
            <span class="label">{{ 'account.profile.fullName' | translate }}:</span>
            <span class="value">{{ user.fullName }}</span>
          </div>
          <div class="info-row" *ngIf="user">
            <span class="label">{{ 'account.profile.email' | translate }}:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-row" *ngIf="user">
            <span class="label">{{ 'account.profile.memberSince' | translate }}:</span>
            <span class="value">{{ user.createdAt | date }}</span>
          </div>
        </div>

        <!-- Subscription Information -->
        <div class="card subscription-info">
          <h2>💳 {{ 'account.subscription.title' | translate }}</h2>
          <div class="current-plan">
            <div class="plan-badge" [class]="subscriptionTier.toLowerCase()">
              {{ subscriptionTier }}
            </div>
            <p class="plan-description" *ngIf="subscriptionTier === 'FREE'">
              {{ 'account.subscription.freeDesc' | translate }}
            </p>
            <p class="plan-description" *ngIf="subscriptionTier === 'PRO'">
              {{ 'account.subscription.proDesc' | translate }}
            </p>
            <p class="plan-description" *ngIf="subscriptionTier === 'TEAM'">
              {{ 'account.subscription.teamDesc' | translate }}
            </p>
          </div>

          <div class="subscription-actions">
            <button
              class="btn btn-primary"
              (click)="goToPricing()"
              *ngIf="subscriptionTier === 'FREE'">
              {{ 'account.subscription.upgrade' | translate }}
            </button>
            <button
              class="btn btn-secondary"
              (click)="manageBilling()"
              *ngIf="subscriptionTier !== 'FREE'">
              {{ 'account.subscription.manageBilling' | translate }}
            </button>
            <button
              class="btn btn-danger"
              (click)="cancelSubscription()"
              *ngIf="subscriptionTier !== 'FREE'"
              [disabled]="loading">
              {{ loading ? ('account.subscription.canceling' | translate) : ('account.subscription.cancel' | translate) }}
            </button>
          </div>
        </div>

        <!-- Usage Statistics -->
        <div class="card usage-stats">
          <h2>📊 {{ 'account.usage.title' | translate }}</h2>
          <div class="stat-item">
            <span class="stat-label">{{ 'account.usage.savedPatterns' | translate }}:</span>
            <span class="stat-value">{{ savedPatternsCount }} / {{ maxPatterns }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ 'account.usage.testsRun' | translate }}:</span>
            <span class="stat-value">∞</span>
          </div>
          <div class="stat-item" *ngIf="subscriptionTier === 'TEAM'">
            <span class="stat-label">{{ 'account.usage.teamMembers' | translate }}:</span>
            <span class="stat-value">1 / {{ 'account.usage.unlimited' | translate }}</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card quick-actions">
          <h2>⚡ {{ 'account.actions.title' | translate }}</h2>
          <button class="action-btn" (click)="goToTester()">
            <span class="icon">🔍</span>
            <span class="text">{{ 'account.actions.testRegex' | translate }}</span>
          </button>
          <button class="action-btn" (click)="goToLibrary()">
            <span class="icon">📚</span>
            <span class="text">{{ 'account.actions.library' | translate }}</span>
          </button>
          <button class="action-btn" (click)="goToContact()">
            <span class="icon">📧</span>
            <span class="text">{{ 'account.actions.contact' | translate }}</span>
          </button>
          <button class="action-btn danger" (click)="logout()">
            <span class="icon">🚪</span>
            <span class="text">{{ 'account.actions.logout' | translate }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.125rem;
        color: var(--text-secondary);
      }
    }

    .account-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .card {
      h2 {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
      }
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);

      .label {
        font-weight: 600;
        color: var(--text-secondary);
      }

      .value {
        color: var(--text-primary);
      }
    }

    .current-plan {
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .plan-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      border-radius: 2rem;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 1rem;

      &.free {
        background-color: var(--bg-tertiary);
        color: var(--text-secondary);
      }

      &.pro {
        background-color: var(--primary-color);
        color: white;
      }

      &.team {
        background-color: var(--success-color);
        color: white;
      }
    }

    .plan-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .subscription-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .usage-stats {
      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        background-color: var(--bg-tertiary);
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;

        .stat-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .stat-value {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 1.125rem;
        }
      }
    }

    .quick-actions {
      .action-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: var(--bg-tertiary);
        border: 2px solid transparent;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 0.75rem;

        &:hover {
          background-color: var(--bg-primary);
          border-color: var(--primary-color);
          transform: translateX(4px);
        }

        &.danger:hover {
          border-color: var(--error-color);
          background-color: #FEE2E2;
        }

        .icon {
          font-size: 1.5rem;
        }

        .text {
          font-weight: 600;
          color: var(--text-primary);
        }
      }
    }

    .btn-danger {
      background-color: var(--error-color);
      color: white;

      &:hover {
        background-color: #DC2626;
      }
    }

    @media (max-width: 768px) {
      .account-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AccountComponent implements OnInit {
  user: any = null;
  subscriptionTier: string = 'FREE';
  savedPatternsCount: number = 0;
  maxPatterns: number = 5;
  loading = false;

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.loadSubscriptionInfo();
  }

  loadSubscriptionInfo() {
    this.subscriptionService.getSubscriptionStatus().subscribe({
      next: (response: any) => {
        this.subscriptionTier = response.tier || 'FREE';
        this.updateMaxPatterns();
      },
      error: (error) => {
        console.error('Error loading subscription:', error);
        this.subscriptionTier = 'FREE';
      }
    });
  }

  updateMaxPatterns() {
    if (this.subscriptionTier === 'PRO' || this.subscriptionTier === 'TEAM') {
      this.maxPatterns = Infinity;
    } else {
      this.maxPatterns = 5;
    }
  }

  goToPricing() {
    this.router.navigate(['/pricing']);
  }

  manageBilling() {
    alert('Redirecting to Stripe billing portal...\nThis feature will be implemented with Stripe Customer Portal.');
  }

  cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    this.loading = true;
    this.subscriptionService.cancelSubscription().subscribe({
      next: () => {
        alert('Subscription cancelled successfully.');
        this.loadSubscriptionInfo();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cancelling subscription:', error);
        alert(error.error?.message || 'Failed to cancel subscription. Please try again.');
        this.loading = false;
      }
    });
  }

  goToTester() {
    this.router.navigate(['/']);
  }

  goToLibrary() {
    this.router.navigate(['/library']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
