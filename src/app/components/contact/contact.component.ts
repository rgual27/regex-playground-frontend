import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="contact-header">
        <h1>📧 Contact Us</h1>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div class="contact-grid">
        <div class="card contact-form">
          <h2>Send us a message</h2>
          <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="formData.name"
                name="name"
                required
                placeholder="John Doe"
              >
            </div>

            <div class="form-group">
              <label for="email">Your Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                placeholder="john@example.com"
              >
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input
                type="text"
                id="subject"
                [(ngModel)]="formData.subject"
                name="subject"
                required
                placeholder="How can we help?"
              >
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                [(ngModel)]="formData.message"
                name="message"
                required
                rows="6"
                placeholder="Tell us more about your question or feedback..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              [disabled]="!contactForm.valid || loading">
              {{ loading ? 'Sending...' : 'Send Message' }}
            </button>

            <p class="success-message" *ngIf="successMessage">
              ✅ {{ successMessage }}
            </p>
            <p class="error-message" *ngIf="errorMessage">
              ❌ {{ errorMessage }}
            </p>
          </form>
        </div>

        <div class="contact-info">
          <div class="card info-card">
            <h3>💬 Get in Touch</h3>
            <div class="info-item">
              <strong>Email:</strong>
              <a href="mailto:support&#64;regexplayground.com">support&#64;regexplayground.com</a>
            </div>
            <div class="info-item">
              <strong>Response Time:</strong>
              <span>Usually within 24 hours</span>
            </div>
          </div>

          <div class="card faq-card">
            <h3>❓ Quick FAQ</h3>
            <div class="faq-item">
              <strong>Can I upgrade my plan?</strong>
              <p>Yes! Go to Pricing and choose your plan.</p>
            </div>
            <div class="faq-item">
              <strong>How do I export code?</strong>
              <p>Pro users can export regex to Java, JavaScript, and Python from the tester.</p>
            </div>
            <div class="faq-item">
              <strong>Need help with regex?</strong>
              <p>Check our pattern library for common examples and explanations.</p>
            </div>
          </div>

          <div class="card social-card">
            <h3>🌐 Follow Us</h3>
            <div class="social-links">
              <a href="https://github.com" target="_blank" class="social-link">
                <span>GitHub</span>
              </a>
              <a href="https://twitter.com" target="_blank" class="social-link">
                <span>Twitter</span>
              </a>
              <a href="https://linkedin.com" target="_blank" class="social-link">
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.125rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
      }
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .contact-form {
      h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }
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
      }

      textarea {
        resize: vertical;
        min-height: 150px;
      }
    }

    .success-message {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #D1FAE5;
      color: var(--success-color);
      border-radius: 0.5rem;
      font-weight: 600;
    }

    .error-message {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #FEE2E2;
      color: var(--error-color);
      border-radius: 0.5rem;
      font-weight: 600;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-card, .faq-card, .social-card {
      h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
      }
    }

    .info-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      strong {
        display: block;
        margin-bottom: 0.25rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      a {
        color: var(--primary-color);
        font-weight: 600;
      }

      span {
        color: var(--text-primary);
      }
    }

    .faq-item {
      margin-bottom: 1.5rem;

      strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
        font-size: 0.9375rem;
        line-height: 1.6;
      }
    }

    .social-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .social-link {
      padding: 0.75rem 1rem;
      background-color: var(--bg-tertiary);
      border-radius: 0.5rem;
      text-align: center;
      font-weight: 600;
      transition: all 0.2s;

      &:hover {
        background-color: var(--primary-color);
        color: white;
        transform: translateY(-2px);
      }
    }

    @media (max-width: 1024px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  loading = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Simulate form submission
    setTimeout(() => {
      this.successMessage = 'Thank you for your message! We\'ll get back to you within 24 hours.';
      this.loading = false;
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }, 1500);
  }
}
