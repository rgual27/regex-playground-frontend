import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="container">
      <div class="pricing-header">
        <h1>{{ 'pricing.title' | translate }}</h1>
        <p>{{ 'pricing.subtitle' | translate }}</p>

        <div class="billing-toggle">
          <button
            class="toggle-btn"
            [class.active]="billingPeriod === 'monthly'"
            (click)="billingPeriod = 'monthly'">
            Monthly
          </button>
          <button
            class="toggle-btn"
            [class.active]="billingPeriod === 'annual'"
            (click)="billingPeriod = 'annual'">
            Annual <span class="discount-badge">Save 20%</span>
          </button>
        </div>
      </div>

      <div class="pricing-grid">
        <!-- Free Plan - Only show if user is FREE -->
        <div class="pricing-card" [class.current]="currentTier === 'FREE'" *ngIf="!tierLoading && currentTier === 'FREE'">
          <div class="plan-badge">{{ 'pricing.currentPlan' | translate }}</div>
          <h3>{{ 'pricing.free.title' | translate }}</h3>
          <div class="price">
            <span class="amount">$0</span>
            <span class="period">{{ 'pricing.free.period' | translate }}</span>
          </div>
          <ul class="features">
            <li>✅ {{ 'pricing.free.features.0' | translate }}</li>
            <li>✅ {{ 'pricing.free.features.1' | translate }}</li>
            <li>✅ {{ 'pricing.free.features.2' | translate }}</li>
            <li>✅ {{ 'pricing.free.features.3' | translate }}</li>
            <li>✅ {{ 'pricing.free.features.4' | translate }}</li>
            <li>❌ {{ 'pricing.free.features.5' | translate }}</li>
            <li>❌ {{ 'pricing.free.features.6' | translate }}</li>
            <li>❌ {{ 'pricing.free.features.7' | translate }}</li>
          </ul>
          <button class="btn w-full btn-secondary" disabled>
            <span>{{ 'pricing.currentPlan' | translate }}</span>
          </button>
        </div>

        <!-- Pro Plan -->
        <div class="pricing-card featured" [class.current]="currentTier === 'PRO'" *ngIf="!tierLoading">
          <div class="plan-badge pro" *ngIf="currentTier === 'PRO'">{{ 'pricing.currentPlan' | translate }}</div>
          <div class="plan-badge pro" *ngIf="currentTier !== 'PRO'">{{ 'pricing.mostPopular' | translate }}</div>
          <h3>{{ 'pricing.pro.title' | translate }}</h3>
          <div class="price">
            <span class="amount">{{ billingPeriod === 'monthly' ? '$7' : '$67' }}</span>
            <span class="period">{{ billingPeriod === 'monthly' ? '/month' : '/year' }}</span>
            <span class="savings" *ngIf="billingPeriod === 'annual'">Save $17/year</span>
          </div>
          <ul class="features">
            <li>✅ {{ 'pricing.pro.features.0' | translate }}</li>
            <li>✅ {{ 'pricing.pro.features.1' | translate }}</li>
            <li>✅ {{ 'pricing.pro.features.2' | translate }}</li>
            <li>✅ {{ 'pricing.pro.features.3' | translate }}</li>
            <li>✅ {{ 'pricing.pro.features.4' | translate }}</li>
            <li>✅ {{ 'pricing.pro.features.5' | translate }}</li>
            <li>✅ {{ 'pricing.pro.features.6' | translate }}</li>
            <li>❌ {{ 'pricing.pro.features.7' | translate }}</li>
          </ul>
          <button
            class="btn w-full"
            [class.btn-primary]="currentTier !== 'PRO'"
            [class.btn-secondary]="currentTier === 'PRO'"
            (click)="subscribe('PRO')"
            [disabled]="loading || currentTier === 'PRO'">
            <span *ngIf="currentTier === 'PRO'">{{ 'pricing.currentPlan' | translate }}</span>
            <span *ngIf="currentTier !== 'PRO'">
              {{ loading && selectedTier === 'PRO' ? ('common.loading' | translate) : ('pricing.startTrial' | translate) }}
            </span>
          </button>
          <p class="trial-note" *ngIf="currentTier !== 'PRO'">{{ 'pricing.trialNote' | translate }}</p>
        </div>

      </div>

      <div class="faq-section">
        <h2>{{ 'pricing.faq.title' | translate }}</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>{{ 'pricing.faq.q1' | translate }}</h4>
            <p>{{ 'pricing.faq.a1' | translate }}</p>
          </div>
          <div class="faq-item">
            <h4>{{ 'pricing.faq.q2' | translate }}</h4>
            <p>{{ 'pricing.faq.a2' | translate }}</p>
          </div>
          <div class="faq-item">
            <h4>{{ 'pricing.faq.q3' | translate }}</h4>
            <p>{{ 'pricing.faq.a3' | translate }}</p>
          </div>
          <div class="faq-item">
            <h4>{{ 'pricing.faq.q4' | translate }}</h4>
            <p>{{ 'pricing.faq.a4' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pricing-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }
    }

    .billing-toggle {
      display: flex;
      justify-content: center;
      gap: 0;
      background: var(--bg-secondary);
      padding: 4px;
      border-radius: 8px;
      width: fit-content;
      margin: 0 auto 2rem;

      .toggle-btn {
        padding: 12px 24px;
        background: transparent;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        position: relative;
        z-index: 1;
        white-space: nowrap;

        &:hover:not(.active) {
          color: var(--text-primary);
        }

        &.active {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

          .discount-badge {
            background: white;
            color: var(--primary-color);
          }
        }
      }

      .discount-badge {
        font-size: 0.75rem;
        background: #10b981;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        margin-left: 8px;
        font-weight: 600;
        display: inline-block;
      }
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .pricing-card {
      background-color: var(--bg-primary);
      border-radius: 0.75rem;
      padding: 2rem;
      border: 2px solid var(--border-color);
      position: relative;
      transition: all 0.3s;

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-4px);
      }

      &.featured {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-lg);
      }
    }

    .plan-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--bg-tertiary);
      color: var(--text-secondary);
      padding: 0.25rem 1rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;

      &.pro {
        background-color: var(--primary-color);
        color: white;
      }
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      margin-top: 0.5rem;
    }

    .price {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .amount {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-color);
      }

      .savings {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #10b981;
        font-weight: 600;
      }

      .period {
        font-size: 1rem;
        color: var(--text-secondary);
      }
    }

    .features {
      list-style: none;
      margin-bottom: 1.5rem;

      li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--bg-tertiary);
        font-size: 0.9375rem;
      }
    }

    .trial-note {
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .faq-section {
      margin-top: 4rem;

      h2 {
        text-align: center;
        margin-bottom: 2rem;
      }
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .faq-item {
      h4 {
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }

      p {
        color: var(--text-secondary);
        line-height: 1.6;
      }
    }

    @media (max-width: 768px) {
      .pricing-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PricingComponent implements OnInit {
  loading = false;
  selectedTier: string = '';
  currentTier: string | null = null;
  tierLoading = true;
  billingPeriod: 'monthly' | 'annual' = 'monthly';

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.loadCurrentPlan();
    } else {
      this.currentTier = 'FREE';
      this.tierLoading = false;
    }
  }

  loadCurrentPlan() {
    this.tierLoading = true;
    this.subscriptionService.getSubscriptionStatus().subscribe({
      next: (response) => {
        this.currentTier = response.tier || 'FREE';
        this.tierLoading = false;
      },
      error: (error) => {
        console.error('Error loading subscription status:', error);
        this.currentTier = 'FREE';
        this.tierLoading = false;
      }
    });
  }

  subscribe(tier: string) {
    if (!this.authService.isAuthenticated) {
      this.notificationService.warning('Please login or register to subscribe');
      return;
    }

    this.loading = true;
    this.selectedTier = tier;

    this.subscriptionService.createCheckoutSession(tier, this.billingPeriod).subscribe({
      next: (response) => {
        window.location.href = response.url;
      },
      error: (error) => {
        console.error('Error creating checkout session:', error);
        this.notificationService.error(error.error?.message || error.error?.error || 'Failed to create checkout session. Please try again.');
        this.loading = false;
        this.selectedTier = '';
      }
    });
  }
}
