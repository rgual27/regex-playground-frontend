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

        <div class="social-share">
          <h3>Share this pattern:</h3>
          <div class="share-buttons">
            <button class="share-btn twitter" (click)="shareOnTwitter()" title="Share on Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </button>
            <button class="share-btn linkedin" (click)="shareOnLinkedIn()" title="Share on LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
            <button class="share-btn copy" (click)="copyUrl()" title="Copy link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Link
            </button>
          </div>
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

    .social-share {
      margin-top: 32px;
      padding: 24px;
      background: var(--bg-primary);
      border-radius: 12px;
      border: 2px solid var(--border-color);
      text-align: center;
    }

    .social-share h3 {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .share-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .share-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .share-btn svg {
      flex-shrink: 0;
    }

    .share-btn.twitter {
      background: #1DA1F2;
      color: white;
      border-color: #1DA1F2;
    }

    .share-btn.twitter:hover {
      background: #1a91da;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(29, 161, 242, 0.4);
    }

    .share-btn.linkedin {
      background: #0A66C2;
      color: white;
      border-color: #0A66C2;
    }

    .share-btn.linkedin:hover {
      background: #095196;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
    }

    .share-btn.copy:hover {
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
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

      .share-buttons {
        flex-direction: column;
      }

      .share-btn {
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

  shareOnTwitter() {
    if (this.sharedPattern) {
      const text = `Check out this regex pattern: ${this.sharedPattern.name}`;
      const url = window.location.href;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
  }

  shareOnLinkedIn() {
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
  }

  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      console.log('URL copied to clipboard');
      alert('Link copied to clipboard!');
    });
  }
}
