import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegexService, RegexTestRequest, RegexTestResponse } from '../../services/regex.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-embed-tester',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="embed-container" [attr.data-theme]="theme">
      <div class="embed-content">
        <!-- Pattern Input -->
        <div class="embed-section">
          <div class="embed-header">
            <label class="embed-label">Regex Pattern</label>
            <div class="flags">
              <label class="flag-label" title="Case insensitive">
                <input type="checkbox" [(ngModel)]="flags.i" (change)="onFlagsChange()">
                <span>i</span>
              </label>
              <label class="flag-label" title="Multiline">
                <input type="checkbox" [(ngModel)]="flags.m" (change)="onFlagsChange()">
                <span>m</span>
              </label>
              <label class="flag-label" title="Dotall">
                <input type="checkbox" [(ngModel)]="flags.s" (change)="onFlagsChange()">
                <span>s</span>
              </label>
            </div>
          </div>
          <div class="input-wrapper">
            <span class="delimiter">/</span>
            <input
              type="text"
              class="pattern-input"
              [(ngModel)]="pattern"
              (ngModelChange)="onPatternChange()"
              placeholder="Enter regex pattern"
              [class.error]="result && !result.isValid"
            >
            <span class="delimiter">/{{ flagsString }}</span>
          </div>
          <div *ngIf="result && !result.isValid" class="error-message">
            ❌ {{ result.error }}
          </div>
        </div>

        <!-- Test String Input -->
        <div class="embed-section">
          <div class="embed-header">
            <label class="embed-label">Test String</label>
            <div class="match-count" *ngIf="result && result.isValid">
              <span [class.has-matches]="result.matchCount! > 0">
                {{ result.matchCount }} {{ result.matchCount === 1 ? 'match' : 'matches' }}
              </span>
            </div>
          </div>
          <textarea
            class="test-input"
            [(ngModel)]="testString"
            (ngModelChange)="onTestStringChange()"
            placeholder="Enter test string"
            rows="4"
          ></textarea>
        </div>

        <!-- Matches Preview -->
        <div class="embed-section" *ngIf="result && result.isValid && result.matchCount! > 0">
          <label class="embed-label">Matches</label>
          <div class="matches-list">
            <div *ngFor="let match of result.matches; let i = index" class="match-item">
              <div class="match-header">
                <strong>Match {{ i + 1 }}</strong>
                <span class="match-pos">[{{ match.start }}-{{ match.end }}]</span>
              </div>
              <div class="match-value">{{ match.fullMatch }}</div>
              <div *ngIf="match.groups.length > 0" class="match-groups">
                <span *ngFor="let group of match.groups; let j = index" class="group-badge">
                  G{{ j + 1 }}: {{ group }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="embed-footer">
        <a href="https://regex-playground.vercel.app" target="_blank" rel="noopener noreferrer" class="powered-by">
          Powered by Regex Playground
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .embed-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      overflow: hidden;
    }

    .embed-container[data-theme="dark"] {
      background: #1e1e1e;
      color: #e0e0e0;
    }

    .embed-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .embed-section {
      margin-bottom: 16px;
    }

    .embed-section:last-child {
      margin-bottom: 0;
    }

    .embed-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .embed-label {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .embed-container[data-theme="dark"] .embed-label {
      color: #e0e0e0;
    }

    .flags {
      display: flex;
      gap: 8px;
    }

    .flag-label {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      font-size: 13px;
      user-select: none;
    }

    .flag-label input[type="checkbox"] {
      width: 14px;
      height: 14px;
      cursor: pointer;
    }

    .flag-label span {
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      padding: 8px 12px;
      transition: border-color 0.2s;
    }

    .embed-container[data-theme="dark"] .input-wrapper {
      background: #2d2d2d;
      border-color: #444;
    }

    .input-wrapper:focus-within {
      border-color: #3B82F6;
    }

    .delimiter {
      font-weight: bold;
      color: #666;
      font-family: 'Courier New', monospace;
      font-size: 16px;
    }

    .embed-container[data-theme="dark"] .delimiter {
      color: #999;
    }

    .pattern-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #333;
    }

    .embed-container[data-theme="dark"] .pattern-input {
      color: #e0e0e0;
    }

    .pattern-input.error {
      color: #dc2626;
    }

    .test-input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      resize: vertical;
      transition: border-color 0.2s;
      background: #f8f9fa;
      color: #333;
    }

    .embed-container[data-theme="dark"] .test-input {
      background: #2d2d2d;
      border-color: #444;
      color: #e0e0e0;
    }

    .test-input:focus {
      outline: none;
      border-color: #3B82F6;
    }

    .error-message {
      margin-top: 8px;
      padding: 8px 12px;
      background: #fee;
      border-left: 3px solid #dc2626;
      border-radius: 4px;
      font-size: 13px;
      color: #dc2626;
    }

    .embed-container[data-theme="dark"] .error-message {
      background: #3d1a1a;
      color: #ff6b6b;
    }

    .match-count {
      font-size: 13px;
      font-weight: 600;
      color: #666;
    }

    .match-count .has-matches {
      color: #10b981;
    }

    .matches-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 200px;
      overflow-y: auto;
    }

    .match-item {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #3B82F6;
    }

    .embed-container[data-theme="dark"] .match-item {
      background: #2d2d2d;
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }

    .match-header strong {
      color: #3B82F6;
    }

    .match-pos {
      color: #666;
      font-family: 'Courier New', monospace;
    }

    .embed-container[data-theme="dark"] .match-pos {
      color: #999;
    }

    .match-value {
      padding: 6px 8px;
      background: #fff;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      word-break: break-all;
      color: #333;
    }

    .embed-container[data-theme="dark"] .match-value {
      background: #1e1e1e;
      color: #e0e0e0;
    }

    .match-groups {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .group-badge {
      display: inline-block;
      padding: 4px 8px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .embed-container[data-theme="dark"] .group-badge {
      background: #1e3a5f;
      color: #60a5fa;
    }

    .embed-footer {
      border-top: 1px solid #e0e0e0;
      padding: 12px 16px;
      text-align: center;
      background: #f8f9fa;
    }

    .embed-container[data-theme="dark"] .embed-footer {
      border-top-color: #444;
      background: #2d2d2d;
    }

    .powered-by {
      color: #3B82F6;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: color 0.2s;
    }

    .powered-by:hover {
      color: #1E40AF;
      text-decoration: underline;
    }

    /* Scrollbar styling */
    .matches-list::-webkit-scrollbar,
    .embed-content::-webkit-scrollbar {
      width: 6px;
    }

    .matches-list::-webkit-scrollbar-track,
    .embed-content::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .embed-container[data-theme="dark"] .matches-list::-webkit-scrollbar-track,
    .embed-container[data-theme="dark"] .embed-content::-webkit-scrollbar-track {
      background: #2d2d2d;
    }

    .matches-list::-webkit-scrollbar-thumb,
    .embed-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .embed-container[data-theme="dark"] .matches-list::-webkit-scrollbar-thumb,
    .embed-container[data-theme="dark"] .embed-content::-webkit-scrollbar-thumb {
      background: #555;
    }

    .matches-list::-webkit-scrollbar-thumb:hover,
    .embed-content::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `]
})
export class EmbedTesterComponent implements OnInit {
  pattern: string = '';
  testString: string = '';
  flags = { i: false, m: false, s: false };
  flagsString: string = '';
  result: RegexTestResponse | null = null;
  theme: string = 'light';

  private patternChange$ = new Subject<void>();
  private testStringChange$ = new Subject<void>();

  constructor(
    private regexService: RegexService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Debounce pattern and test string changes
    this.patternChange$.pipe(debounceTime(500)).subscribe(() => this.testPattern());
    this.testStringChange$.pipe(debounceTime(500)).subscribe(() => this.testPattern());

    // Load parameters from query string
    this.route.queryParams.subscribe(params => {
      if (params['pattern']) {
        this.pattern = params['pattern'];
      }
      if (params['test']) {
        this.testString = params['test'];
      }
      if (params['theme']) {
        this.theme = params['theme'] === 'dark' ? 'dark' : 'light';
      }

      // Parse flags
      const flags = params['flags'] || '';
      this.flags.i = flags.includes('i');
      this.flags.m = flags.includes('m');
      this.flags.s = flags.includes('s');
      this.updateFlagsString();

      // Test pattern if both pattern and test string exist
      if (this.pattern && this.testString) {
        setTimeout(() => this.testPattern(), 100);
      }
    });

    // Track embed view (send analytics)
    this.trackEmbedView();
  }

  onPatternChange() {
    this.patternChange$.next();
  }

  onTestStringChange() {
    this.testStringChange$.next();
  }

  onFlagsChange() {
    this.updateFlagsString();
    this.testPattern();
  }

  updateFlagsString() {
    this.flagsString = '';
    if (this.flags.i) this.flagsString += 'i';
    if (this.flags.m) this.flagsString += 'm';
    if (this.flags.s) this.flagsString += 's';
  }

  testPattern() {
    if (!this.pattern || !this.testString) {
      this.result = null;
      return;
    }

    const request: RegexTestRequest = {
      pattern: this.pattern,
      testString: this.testString,
      flags: this.flagsString
    };

    this.regexService.testRegex(request).subscribe({
      next: (response) => {
        this.result = response;
        this.trackEmbedInteraction();
      },
      error: (error) => {
        console.error('Error testing regex:', error);
      }
    });
  }

  private trackEmbedView() {
    // Track that the embed widget was loaded
    this.regexService.trackEmbedEvent('view').subscribe({
      next: () => console.log('Embed view tracked'),
      error: (err) => console.error('Failed to track embed view:', err)
    });
  }

  private trackEmbedInteraction() {
    // Track that user interacted with the embed widget
    this.regexService.trackEmbedEvent('interaction').subscribe({
      next: () => console.log('Embed interaction tracked'),
      error: (err) => console.error('Failed to track embed interaction:', err)
    });
  }
}
