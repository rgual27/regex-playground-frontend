import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that fits your needs. All plans include 14-day free trial.</p>
      </div>

      <div class="pricing-grid">
        <!-- Free Plan -->
        <div class="pricing-card" [class.current]="currentTier === 'FREE'">
          <div class="plan-badge" *ngIf="currentTier === 'FREE'">CURRENT PLAN</div>
          <h3>Free</h3>
          <div class="price">
            <span class="amount">$0</span>
            <span class="period">/month</span>
          </div>
          <ul class="features">
            <li>✅ Unlimited regex testing</li>
            <li>✅ Real-time results</li>
            <li>✅ 5 saved patterns</li>
            <li>✅ Pattern explanations</li>
            <li>✅ Quick reference</li>
            <li>❌ Code export</li>
            <li>❌ Private patterns</li>
            <li>❌ Team sharing</li>
          </ul>
          <button class="btn btn-secondary w-full">Current Plan</button>
        </div>

        <!-- Pro Plan -->
        <div class="pricing-card featured" [class.current]="currentTier === 'PRO'">
          <div class="plan-badge pro" *ngIf="currentTier === 'PRO'">CURRENT PLAN</div>
          <div class="plan-badge pro" *ngIf="currentTier !== 'PRO'">MOST POPULAR</div>
          <h3>Pro</h3>
          <div class="price">
            <span class="amount">$7</span>
            <span class="period">/month</span>
          </div>
          <ul class="features">
            <li>✅ Everything in Free</li>
            <li>✅ Unlimited saved patterns</li>
            <li>✅ Organize in folders</li>
            <li>✅ Export code (Java, JS, Python)</li>
            <li>✅ Private patterns</li>
            <li>✅ Version history</li>
            <li>✅ Priority support</li>
            <li>❌ Team collaboration</li>
          </ul>
          <button class="btn btn-primary w-full" (click)="subscribe('PRO')" [disabled]="loading">
            {{ loading && selectedTier === 'PRO' ? 'Loading...' : 'Start Free Trial' }}
          </button>
          <p class="trial-note">No credit card required for trial</p>
        </div>

        <!-- Team Plan -->
        <div class="pricing-card" [class.current]="currentTier === 'TEAM'">
          <div class="plan-badge" *ngIf="currentTier === 'TEAM'">CURRENT PLAN</div>
          <div class="plan-badge" *ngIf="currentTier !== 'TEAM'">BEST VALUE</div>
          <h3>Team</h3>
          <div class="price">
            <span class="amount">$25</span>
            <span class="period">/month</span>
          </div>
          <ul class="features">
            <li>✅ Everything in Pro</li>
            <li>✅ Unlimited team members</li>
            <li>✅ Shared pattern library</li>
            <li>✅ Team analytics</li>
            <li>✅ API access (1000 calls/day)</li>
            <li>✅ Slack integration</li>
            <li>✅ SSO (optional)</li>
            <li>✅ Priority support</li>
          </ul>
          <button class="btn btn-primary w-full" (click)="subscribe('TEAM')" [disabled]="loading">
            {{ loading && selectedTier === 'TEAM' ? 'Loading...' : 'Start Free Trial' }}
          </button>
          <p class="trial-note">No credit card required for trial</p>
        </div>
      </div>

      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>Can I cancel anytime?</h4>
            <p>Yes! You can cancel your subscription at any time. No questions asked.</p>
          </div>
          <div class="faq-item">
            <h4>Do you offer refunds?</h4>
            <p>Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
          </div>
          <div class="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards via Stripe. Enterprise plans can pay via invoice.</p>
          </div>
          <div class="faq-item">
            <h4>Is there a discount for annual billing?</h4>
            <p>Yes! Save 20% by paying annually. Contact us for details.</p>
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
