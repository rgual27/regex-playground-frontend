import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pricing-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="pricing-header">
        <h1>🎉 Regex Playground is 100% Free!</h1>
        <p class="subtitle">No subscriptions. No paywalls. No limits.</p>
        <p class="description">
          This tool was built to help developers learn and master regular expressions.
          Everything you see is completely free and will always be.
        </p>
      </div>

      <div class="features-showcase">
        <h2>✨ What You Get (For Free!)</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Unlimited Testing</h3>
            <p>Test as many patterns as you want, anytime</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>Unlimited Patterns</h3>
            <p>Save all your regex patterns with no limits</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>Learn & Grow</h3>
            <p>Access examples, challenges, and cheat sheets</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌐</div>
            <h3>Share & Collaborate</h3>
            <p>Share patterns with the community</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>Compete</h3>
            <p>Join challenges and climb the leaderboard</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h3>Read & Learn</h3>
            <p>Access comprehensive regex tutorials</p>
          </div>
        </div>
      </div>

      <div class="support-section">
        <div class="support-card">
          <h2>❤️ Support This Project</h2>
          <p>If you find Regex Playground useful and want to support its development, you can:</p>

          <div class="support-options">
            <button (click)="donate()" [disabled]="loading" class="support-btn primary">
              <span class="btn-icon">❤️</span>
              <div class="btn-content">
                <strong>{{ loading ? 'Processing...' : 'Donate Any Amount' }}</strong>
                <small>Choose your amount • Secure with Stripe</small>
              </div>
            </button>
          </div>

          <p class="support-note">
            💡 You can donate any amount you want - starting from $1, increasing by $1 increments!<br>
            Your support helps keep the servers running and enables me to add more features! 🚀
          </p>

          <div class="other-ways">
            <h3>Other Ways to Help:</h3>
            <ul>
              <li>⭐ Star the project on <a href="https://github.com/rgual27/regex-playground" target="_blank">GitHub</a></li>
              <li>🐦 Share on <a href="https://twitter.com/intent/tweet?text=Check out Regex Playground - a free tool for testing and learning regex!&url=https://regexplayground.com" target="_blank">Twitter</a></li>
              <li>💬 Share with your dev community</li>
              <li>🐛 Report bugs or suggest features</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="transparency-section">
        <h2>📊 Transparency</h2>
        <p>Monthly costs to run Regex Playground:</p>
        <div class="costs-grid">
          <div class="cost-item">
            <strong>Hosting (Render + Vercel)</strong>
            <span>~$7/month</span>
          </div>
          <div class="cost-item">
            <strong>Database (Supabase)</strong>
            <span>~$0/month (Free tier)</span>
          </div>
          <div class="cost-item">
            <strong>Domain</strong>
            <span>~$1/month</span>
          </div>
          <div class="cost-item total">
            <strong>Total</strong>
            <span>~$8/month</span>
          </div>
        </div>
        <p class="costs-note">Every donation helps cover these costs and supports future development!</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .pricing-header {
      text-align: center;
      margin-bottom: 60px;

      h1 {
        font-size: 3rem;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        font-size: 1.5rem;
        color: var(--text-secondary);
        margin-bottom: 24px;
      }

      .description {
        font-size: 1.1rem;
        color: var(--text-secondary);
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.6;
      }
    }

    .features-showcase {
      margin-bottom: 80px;

      h2 {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 40px;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .feature-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        border-color: #3b82f6;
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 1.3rem;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
        line-height: 1.6;
      }
    }

    .support-section {
      margin-bottom: 60px;
    }

    .support-card {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 16px;
      padding: 48px;
      color: white;
      text-align: center;

      h2 {
        font-size: 2.5rem;
        margin-bottom: 16px;
      }

      p {
        font-size: 1.1rem;
        margin-bottom: 32px;
        opacity: 0.95;
      }
    }

    .support-options {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }

    .support-btn {
      background: white;
      color: #1e293b;
      padding: 20px 32px;
      border-radius: 12px;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 220px;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      .btn-icon {
        font-size: 2rem;
      }

      .btn-content {
        text-align: left;

        strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        small {
          color: #64748b;
          font-size: 0.9rem;
        }
      }
    }

    .support-note {
      font-size: 1rem;
      opacity: 0.9;
      margin-top: 24px;
    }

    .other-ways {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      margin-top: 32px;

      h3 {
        font-size: 1.3rem;
        margin-bottom: 16px;
      }

      ul {
        list-style: none;
        padding: 0;
        text-align: left;
        max-width: 500px;
        margin: 0 auto;

        li {
          margin-bottom: 12px;
          font-size: 1rem;

          a {
            color: white;
            text-decoration: underline;

            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }

    .transparency-section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 40px;
      text-align: center;

      h2 {
        font-size: 2rem;
        margin-bottom: 24px;
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 24px;
      }
    }

    .costs-grid {
      max-width: 500px;
      margin: 0 auto 24px;
      background: var(--bg-primary);
      border-radius: 8px;
      padding: 24px;
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      &.total {
        margin-top: 12px;
        padding-top: 20px;
        border-top: 2px solid var(--border-color);
        font-size: 1.2rem;
        color: var(--primary-color);
      }

      strong {
        color: var(--text-primary);
      }

      span {
        color: var(--text-secondary);
      }
    }

    .costs-note {
      font-size: 0.95rem;
      color: var(--text-secondary);
      font-style: italic;
    }

    @media (max-width: 768px) {
      .pricing-header h1 {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .support-card {
        padding: 32px 20px;
      }

      .support-options {
        flex-direction: column;
      }

      .support-btn {
        width: 100%;
      }
    }
  `]
})
export class PricingSimpleComponent {
  loading = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private notificationService: NotificationService
  ) {}

  donate() {
    this.loading = true;

    // Create Stripe checkout session for donation
    this.subscriptionService.createDonationSession().subscribe({
      next: (response) => {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      },
      error: (error) => {
        console.error('Error creating donation session:', error);
        this.notificationService.error('Failed to process donation. Please try again.');
        this.loading = false;
      }
    });
  }
}
