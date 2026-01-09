import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="container">
      <div class="contact-header">
        <h1>📧 {{ 'contact.title' | translate }}</h1>
        <p>{{ 'contact.subtitle' | translate }}</p>
      </div>

      <div class="contact-grid">
        <div class="card contact-form">
          <h2>{{ 'contact.form.title' | translate }}</h2>
          <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
            <div class="form-group">
              <label for="name">{{ 'contact.form.name' | translate }}</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="formData.name"
                name="name"
                required
                [placeholder]="'contact.form.namePlaceholder' | translate"
              >
            </div>

            <div class="form-group">
              <label for="email">{{ 'contact.form.email' | translate }}</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                [placeholder]="'contact.form.emailPlaceholder' | translate"
              >
            </div>

            <div class="form-group">
              <label for="subject">{{ 'contact.form.subject' | translate }}</label>
              <input
                type="text"
                id="subject"
                [(ngModel)]="formData.subject"
                name="subject"
                required
                [placeholder]="'contact.form.subjectPlaceholder' | translate"
              >
            </div>

            <div class="form-group">
              <label for="message">{{ 'contact.form.message' | translate }}</label>
              <textarea
                id="message"
                [(ngModel)]="formData.message"
                name="message"
                required
                rows="6"
                [placeholder]="'contact.form.messagePlaceholder' | translate"
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              [disabled]="!contactForm.valid || loading">
              {{ loading ? ('contact.form.sending' | translate) : ('contact.form.send' | translate) }}
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
            <h3>💬 {{ 'contact.info.title' | translate }}</h3>
            <div class="info-item">
              <strong>{{ 'contact.info.email' | translate }}:</strong>
              <a href="mailto:rgb.for.business&#64;gmail.com">rgb.for.business&#64;gmail.com</a>
            </div>
            <div class="info-item">
              <strong>{{ 'contact.info.responseTime' | translate }}:</strong>
              <span>{{ 'contact.info.responseValue' | translate }}</span>
            </div>
          </div>

          <div class="card faq-card">
            <h3>❓ {{ 'contact.faq.title' | translate }}</h3>
            <div class="faq-item">
              <strong>{{ 'contact.faq.q1' | translate }}</strong>
              <p>{{ 'contact.faq.a1' | translate }}</p>
            </div>
            <div class="faq-item">
              <strong>{{ 'contact.faq.q2' | translate }}</strong>
              <p>{{ 'contact.faq.a2' | translate }}</p>
            </div>
            <div class="faq-item">
              <strong>{{ 'contact.faq.q3' | translate }}</strong>
              <p>{{ 'contact.faq.a3' | translate }}</p>
            </div>
          </div>

          <div class="card social-card">
            <h3>🌐 {{ 'contact.social.title' | translate }}</h3>
            <div class="social-links">
              <a href="https://github.com/rgual27" target="_blank" rel="noopener noreferrer" class="social-link">
                <span>GitHub</span>
              </a>
              <a href="https://x.com/RGBCuba" target="_blank" rel="noopener noreferrer" class="social-link">
                <span>X (Twitter)</span>
              </a>
              <a href="https://www.linkedin.com/in/rafael-gual-borges-a0ab03128/" target="_blank" rel="noopener noreferrer" class="social-link">
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

  constructor(private contactService: ContactService) {}

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.contactService.sendContactMessage(this.formData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loading = false;
        this.formData = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.errorMessage = error.error?.error || 'Failed to send message. Please try again later or email us directly at rgb.for.business@gmail.com';
        this.loading = false;
      }
    });
  }
}
