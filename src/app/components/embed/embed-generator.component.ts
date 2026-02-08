import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';

interface EmbedConfig {
  width: string;
  height: string;
  theme: 'light' | 'dark';
  defaultPattern: string;
  defaultTest: string;
}

@Component({
  selector: 'app-embed-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <div class="container">
      <div class="hero">
        <h1>📦 Embed Regex Tester</h1>
        <p>Add a powerful regex testing widget to your website and drive traffic back to Regex Playground</p>
      </div>

      <div class="embed-grid">
        <!-- Configuration Panel -->
        <div class="card config-panel">
          <h2>Customize Your Widget</h2>

          <div class="form-group">
            <label>Width</label>
            <select [(ngModel)]="config.width" (change)="updatePreview()" class="form-control">
              <option value="100%">100% (Responsive)</option>
              <option value="500px">500px</option>
              <option value="600px">600px</option>
              <option value="800px">800px</option>
            </select>
          </div>

          <div class="form-group">
            <label>Height</label>
            <select [(ngModel)]="config.height" (change)="updatePreview()" class="form-control">
              <option value="400px">400px (Compact)</option>
              <option value="500px">500px</option>
              <option value="600px">600px (Recommended)</option>
              <option value="800px">800px (Spacious)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Theme</label>
            <div class="theme-selector">
              <label class="theme-option">
                <input type="radio" name="theme" value="light" [(ngModel)]="config.theme" (change)="updatePreview()">
                <span class="theme-preview theme-light">Light</span>
              </label>
              <label class="theme-option">
                <input type="radio" name="theme" value="dark" [(ngModel)]="config.theme" (change)="updatePreview()">
                <span class="theme-preview theme-dark">Dark</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Default Pattern (Optional)</label>
            <input
              type="text"
              [(ngModel)]="config.defaultPattern"
              (ngModelChange)="updatePreview()"
              placeholder="e.g., [a-zA-Z0-9]+"
              class="form-control">
            <small class="form-hint">Pre-fill the regex pattern field</small>
          </div>

          <div class="form-group">
            <label>Default Test String (Optional)</label>
            <textarea
              [(ngModel)]="config.defaultTest"
              (ngModelChange)="updatePreview()"
              placeholder="e.g., Test123"
              class="form-control"
              rows="2"
            ></textarea>
            <small class="form-hint">Pre-fill the test string field</small>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="card preview-panel">
          <h2>Live Preview</h2>
          <div class="preview-container" [style.height]="config.height">
            <iframe
              [src]="iframeUrl"
              [style.width]="config.width"
              [style.height]="config.height"
              frameborder="0"
              class="embed-preview"
            ></iframe>
          </div>
        </div>

        <!-- Embed Code Panel -->
        <div class="card code-panel">
          <h2>Embed Code</h2>
          <p class="code-description">Copy and paste this code into your website:</p>

          <div class="code-block">
            <pre><code>{{ embedCode }}</code></pre>
            <button class="copy-btn" (click)="copyCode()" title="Copy to clipboard">
              {{ copied ? '✓ Copied!' : '📋 Copy' }}
            </button>
          </div>

          <div class="code-features">
            <h3>Features:</h3>
            <ul>
              <li>✓ Lightweight and fast loading</li>
              <li>✓ Responsive design</li>
              <li>✓ No external dependencies</li>
              <li>✓ Links back to Regex Playground</li>
              <li>✓ Real-time regex testing</li>
              <li>✓ Match highlighting and grouping</li>
            </ul>
          </div>
        </div>

        <!-- Documentation Panel -->
        <div class="card docs-panel">
          <h2>How to Use</h2>

          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Customize Your Widget</h3>
              <p>Use the options above to configure the widget's size, theme, and default values.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Copy the Embed Code</h3>
              <p>Click the "Copy" button to copy the HTML embed code to your clipboard.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Add to Your Website</h3>
              <p>Paste the code into your HTML where you want the widget to appear.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Done!</h3>
              <p>The widget will automatically load and be ready for your visitors to use.</p>
            </div>
          </div>
        </div>

        <!-- Terms Panel -->
        <div class="card terms-panel">
          <h2>Terms of Use</h2>
          <div class="terms-content">
            <p><strong>You are free to embed this widget on your website with the following conditions:</strong></p>
            <ul>
              <li>The "Powered by Regex Playground" footer link must remain visible and unmodified</li>
              <li>The widget must not be used for malicious purposes</li>
              <li>We reserve the right to disable embed functionality for any domain at our discretion</li>
              <li>The widget is provided "as-is" without warranties of any kind</li>
              <li>We may collect anonymous usage statistics from embedded widgets</li>
            </ul>
            <p class="terms-note">
              By embedding this widget, you agree to these terms. For questions or support,
              <a routerLink="/contact">contact us</a>.
            </p>
          </div>
        </div>

        <!-- Examples Panel -->
        <div class="card examples-panel">
          <h2>Example Use Cases</h2>

          <div class="example">
            <h3>📚 Educational Websites</h3>
            <p>Add an interactive regex tester to your programming tutorials and courses to help students learn regex patterns hands-on.</p>
          </div>

          <div class="example">
            <h3>📖 Documentation Sites</h3>
            <p>Embed the widget in your API or library documentation to demonstrate regex patterns used in your code.</p>
          </div>

          <div class="example">
            <h3>💬 Developer Forums</h3>
            <p>Allow forum members to test and share regex patterns directly in discussion threads.</p>
          </div>

          <div class="example">
            <h3>📝 Technical Blogs</h3>
            <p>Enhance your blog posts about regex with an interactive tester so readers can experiment with examples.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      color: var(--text-secondary);
    }

    .embed-grid {
      display: grid;
      gap: 2rem;
    }

    .card {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: var(--shadow-md);
    }

    .card h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .card h3 {
      font-size: 1.2rem;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .form-hint {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .theme-selector {
      display: flex;
      gap: 1rem;
    }

    .theme-option {
      flex: 1;
      cursor: pointer;
    }

    .theme-option input[type="radio"] {
      display: none;
    }

    .theme-preview {
      display: block;
      padding: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      transition: all 0.2s;
    }

    .theme-option input[type="radio"]:checked + .theme-preview {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
    }

    .theme-light {
      background: #ffffff;
      color: #333;
    }

    .theme-dark {
      background: #1e1e1e;
      color: #e0e0e0;
    }

    .preview-container {
      border: 2px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .embed-preview {
      width: 100%;
      height: 100%;
      display: block;
    }

    .code-description {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .code-block {
      position: relative;
      background: #2d2d2d;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .code-block pre {
      margin: 0;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .copy-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
    }

    .code-features h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .code-features ul {
      list-style: none;
      padding: 0;
    }

    .code-features li {
      padding: 0.5rem 0;
      color: var(--text-primary);
    }

    .step {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .step:last-child {
      margin-bottom: 0;
    }

    .step-number {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .step-content h3 {
      margin-top: 0;
    }

    .step-content p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .terms-content p {
      margin-bottom: 1rem;
      line-height: 1.6;
      color: var(--text-primary);
    }

    .terms-content ul {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .terms-content li {
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .terms-note {
      padding: 1rem;
      background: var(--bg-secondary);
      border-left: 4px solid var(--primary-color);
      border-radius: 4px;
      font-size: 0.95rem;
    }

    .terms-note a {
      color: var(--primary-color);
      font-weight: 600;
    }

    .example {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
    }

    .example:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .example h3 {
      margin-bottom: 0.75rem;
    }

    .example p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero p {
        font-size: 1rem;
      }

      .card {
        padding: 1.5rem;
      }

      .theme-selector {
        flex-direction: column;
      }

      .step {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class EmbedGeneratorComponent implements OnInit {
  config: EmbedConfig = {
    width: '100%',
    height: '600px',
    theme: 'light',
    defaultPattern: '',
    defaultTest: ''
  };

  embedCode: string = '';
  iframeUrl: SafeResourceUrl = '';
  copied: boolean = false;
  private baseUrl: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Get base URL (use production URL in production, localhost in development)
    this.baseUrl = window.location.origin;

    // Generate initial preview and embed code
    this.updatePreview();
  }

  updatePreview() {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('theme', this.config.theme);

    if (this.config.defaultPattern) {
      params.append('pattern', this.config.defaultPattern);
    }

    if (this.config.defaultTest) {
      params.append('test', this.config.defaultTest);
    }

    // Build iframe URL
    const url = `${this.baseUrl}/embed/tester?${params.toString()}`;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    // Generate embed code
    this.embedCode = this.generateEmbedCode(url);

    // Reset copied state
    this.copied = false;
  }

  private generateEmbedCode(url: string): string {
    return `<iframe
  src="${url}"
  width="${this.config.width}"
  height="${this.config.height}"
  frameborder="0"
  style="border: 1px solid #e0e0e0; border-radius: 8px;"
  title="Regex Playground Tester"
></iframe>`;
  }

  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.embedCode);
      this.copied = true;
      this.notificationService.success('Embed code copied to clipboard!');

      // Reset copied state after 3 seconds
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      this.notificationService.error('Failed to copy embed code. Please copy manually.');
    }
  }
}
