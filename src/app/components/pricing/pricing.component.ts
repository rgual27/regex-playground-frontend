import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="container">
      <div class="pricing-header">
        <h1>{{ 'pricing.title' | translate }}</h1>
        <p>{{ 'pricing.subtitle' | translate }}</p>
      </div>

      <div class="pricing-grid">
        <!-- Free Plan -->
        <div class="pricing-card" [class.current]="currentTier === 'FREE'">
          <div class="plan-badge" *ngIf="currentTier === 'FREE'">{{ 'pricing.currentPlan' | translate }}</div>
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
          <button class="btn btn-secondary w-full">{{ 'pricing.currentPlan' | translate }}</button>
        </div>

        <!-- Pro Plan -->
        <div class="pricing-card featured" [class.current]="currentTier === 'PRO'">
          <div class="plan-badge pro" *ngIf="currentTier === 'PRO'">{{ 'pricing.currentPlan' | translate }}</div>
          <div class="plan-badge pro" *ngIf="currentTier !== 'PRO'">{{ 'pricing.mostPopular' | translate }}</div>
          <h3>{{ 'pricing.pro.title' | translate }}</h3>
          <div class="price">
            <span class="amount">$7</span>
            <span class="period">{{ 'pricing.pro.period' | translate }}</span>
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
          <button class="btn btn-primary w-full" (click)="subscribe('PRO')" [disabled]="loading">
            {{ loading && selectedTier === 'PRO' ? ('common.loading' | translate) : ('pricing.startTrial' | translate) }}
          </button>
          <p class="trial-note">{{ 'pricing.trialNote' | translate }}</p>
        </div>

        <!-- Team Plan -->
        <div class="pricing-card" [class.current]="currentTier === 'TEAM'">
          <div class="plan-badge" *ngIf="currentTier === 'TEAM'">{{ 'pricing.currentPlan' | translate }}</div>
          <div class="plan-badge" *ngIf="currentTier !== 'TEAM'">{{ 'pricing.bestValue' | translate }}</div>
          <h3>{{ 'pricing.team.title' | translate }}</h3>
          <div class="price">
            <span class="amount">$25</span>
            <span class="period">{{ 'pricing.team.period' | translate }}</span>
          </div>
          <ul class="features">
            <li>✅ {{ 'pricing.team.features.0' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.1' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.2' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.3' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.4' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.5' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.6' | translate }}</li>
            <li>✅ {{ 'pricing.team.features.7' | translate }}</li>
          </ul>
          <button class="btn btn-primary w-full" (click)="subscribe('TEAM')" [disabled]="loading">
            {{ loading && selectedTier === 'TEAM' ? ('common.loading' | translate) : ('pricing.startTrial' | translate) }}
          </button>
          <p class="trial-note">{{ 'pricing.trialNote' | translate }}</p>
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

      .amount {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-color);
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
  currentTier: string = 'FREE';

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.loadCurrentPlan();
    }
  }

  loadCurrentPlan() {
    this.subscriptionService.getSubscriptionStatus().subscribe({
      next: (response) => {
        this.currentTier = response.tier || 'FREE';
      },
      error: (error) => {
        console.error('Error loading subscription status:', error);
      }
    });
  }

  subscribe(tier: string) {
    if (!this.authService.isAuthenticated) {
      alert('Please login or register to subscribe');
      return;
    }

    this.loading = true;
    this.selectedTier = tier;

    this.subscriptionService.createCheckoutSession(tier).subscribe({
      next: (response) => {
        window.location.href = response.url;
      },
      error: (error) => {
        console.error('Error creating checkout session:', error);
        alert(error.error?.message || 'Failed to create checkout session. Please try again.');
        this.loading = false;
        this.selectedTier = '';
      }
    });
  }
}
