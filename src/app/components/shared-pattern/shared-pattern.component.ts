import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

interface SharedPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
  testString: string;
  flags: string;
  viewCount: number;
  shareCount: number;
  ownerName: string;
  createdAt: string;
}

@Component({
  selector: 'app-shared-pattern',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="shared-container">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading shared pattern...</p>
      </div>

      <div *ngIf="error" class="error-box">
        <h2>❌ Pattern Not Found</h2>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="goHome()">Go to Homepage</button>
      </div>

      <div *ngIf="sharedPattern && !loading" class="pattern-display">
        <div class="pattern-header">
          <h1>{{ sharedPattern.name }}</h1>
          <div class="pattern-stats">
            <span class="stat">👁️ {{ sharedPattern.viewCount }} views</span>
            <span class="stat">🔗 {{ sharedPattern.shareCount }} shares</span>
          </div>
        </div>

        <div class="pattern-meta">
          <span class="owner">Created by: {{ sharedPattern.ownerName }}</span>
          <span class="date">{{ formatDate(sharedPattern.createdAt) }}</span>
        </div>

        <div *ngIf="sharedPattern.description" class="pattern-description">
          <p>{{ sharedPattern.description }}</p>
        </div>

        <div class="pattern-code">
          <h3>Regular Expression</h3>
          <div class="code-display">
            <code>/{{ sharedPattern.pattern }}/{{ sharedPattern.flags }}</code>
            <button class="copy-btn" (click)="copyPattern()" title="Copy to clipboard">
              📋 Copy
            </button>
          </div>
        </div>

        <div class="test-string-display" *ngIf="sharedPattern.testString">
          <h3>Test String</h3>
          <pre class="test-string">{{ sharedPattern.testString }}</pre>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" (click)="tryThisPattern()">
            🚀 Try This Pattern
          </button>
          <button class="btn btn-secondary" (click)="goHome()">
            🏠 Go to Homepage
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shared-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      min-height: 80vh;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 20px;
      border: 4px solid var(--border-color);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-box {
      text-align: center;
      padding: 60px 20px;
      background: var(--bg-secondary);
      border: 2px solid #ef4444;
      border-radius: 12px;
    }

    .error-box h2 {
      color: #ef4444;
      margin-bottom: 16px;
    }

    .error-box p {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .pattern-display {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .pattern-header {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
    }

    .pattern-header h1 {
      font-size: 2rem;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .pattern-stats {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .stat {
      padding: 8px 16px;
      background: var(--bg-primary);
      border-radius: 20px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }

    .pattern-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--bg-primary);
      border-radius: 8px;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .pattern-description {
      margin-bottom: 24px;
      padding: 20px;
      background: rgba(59, 130, 246, 0.1);
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
    }

    .pattern-description p {
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0;
    }

    .pattern-code {
      margin-bottom: 24px;
    }

    .pattern-code h3 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .code-display {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
    }

    .code-display code {
      flex: 1;
      font-family: 'Courier New', monospace;
      font-size: 1.3rem;
      color: #3b82f6;
      font-weight: 600;
      word-break: break-all;
    }

    .copy-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .copy-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .test-string-display {
      margin-bottom: 24px;
    }

    .test-string-display h3 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .test-string {
      padding: 20px;
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      color: var(--text-primary);
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 300px;
      overflow-y: auto;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 14px 32px;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .btn-secondary {
      background: var(--bg-primary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .pattern-display {
        padding: 20px;
      }

      .pattern-header h1 {
        font-size: 1.5rem;
      }

      .code-display {
        flex-direction: column;
        align-items: stretch;
      }

      .copy-btn {
        width: 100%;
      }

      .pattern-meta {
        flex-direction: column;
        gap: 8px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class SharedPatternComponent implements OnInit {
  sharedPattern: SharedPattern | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const shareCode = this.route.snapshot.paramMap.get('shareCode');
    if (shareCode) {
      this.loadSharedPattern(shareCode);
    } else {
      this.error = 'Invalid share code';
      this.loading = false;
    }
  }

  loadSharedPattern(shareCode: string) {
    this.http.get<SharedPattern>(`${environment.apiUrl}/share/r/${shareCode}`)
      .subscribe({
        next: (pattern) => {
          this.sharedPattern = pattern;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Pattern not found';
          this.loading = false;
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  copyPattern() {
    if (this.sharedPattern) {
      const pattern = `/${this.sharedPattern.pattern}/${this.sharedPattern.flags}`;
      navigator.clipboard.writeText(pattern).then(() => {
        console.log('Pattern copied to clipboard');
      });
    }
  }

  tryThisPattern() {
    if (this.sharedPattern) {
      this.router.navigate(['/'], {
        queryParams: {
          pattern: this.sharedPattern.pattern,
          flags: this.sharedPattern.flags,
          test: this.sharedPattern.testString
        }
      });
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
