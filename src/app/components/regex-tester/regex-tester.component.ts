import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegexService, RegexTestRequest, RegexTestResponse } from '../../services/regex.service';
import { PatternService, RegexPattern } from '../../services/pattern.service';
import { AuthService } from '../../services/auth.service';
import { debounceTime, Subject } from 'rxjs';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="hero">
        <h1>🔍 Test Your Regex Patterns</h1>
        <p>Real-time regex testing with instant results. Test JavaScript, Python, and Java patterns.</p>
      </div>

      <div class="tester-grid">
        <!-- Pattern Input Section -->
        <div class="card pattern-section">
          <div class="section-header">
            <h2>Regular Expression</h2>
            <div class="flags">
              <label class="flag-label">
                <input type="checkbox" [(ngModel)]="flags.i" (change)="onFlagsChange()">
                <span>i</span>
              </label>
              <label class="flag-label">
                <input type="checkbox" [(ngModel)]="flags.m" (change)="onFlagsChange()">
                <span>m</span>
              </label>
              <label class="flag-label">
                <input type="checkbox" [(ngModel)]="flags.s" (change)="onFlagsChange()">
                <span>s</span>
              </label>
            </div>
          </div>

          <div class="input-group">
            <span class="regex-slash">/</span>
            <input
              type="text"
              class="regex-input"
              [(ngModel)]="pattern"
              (ngModelChange)="onPatternChange()"
              placeholder="Enter your regex pattern"
              [class.error]="result && !result.isValid"
            >
            <span class="regex-slash">/{{ flagsString }}</span>
          </div>

          <div *ngIf="result && !result.isValid" class="error-message">
            <strong>❌ Error:</strong> {{ result.error }}
          </div>

          <div *ngIf="result && result.isValid && result.explanation" class="explanation">
            <strong>💡 Pattern explanation:</strong> {{ result.explanation }}
          </div>
        </div>

        <!-- Test String Section -->
        <div class="card test-section">
          <div class="section-header">
            <h2>Test String</h2>
            <div class="match-counter" *ngIf="result && result.isValid">
              <span [class.has-matches]="result.matchCount! > 0">
                {{ result.matchCount }} {{ result.matchCount === 1 ? 'match' : 'matches' }}
              </span>
            </div>
          </div>

          <textarea
            class="test-input"
            [(ngModel)]="testString"
            (ngModelChange)="onTestStringChange()"
            placeholder="Enter test string here..."
            rows="10"
          ></textarea>

          <div *ngIf="result && result.isValid && result.matchCount! > 0" class="matches-preview">
            <div *ngFor="let match of result.matches; let i = index" class="match-item">
              <div class="match-header">
                <strong>Match {{ i + 1 }}</strong>
                <span class="match-position">[{{ match.start }} - {{ match.end }}]</span>
              </div>
              <div class="match-value">{{ match.fullMatch }}</div>
              <div *ngIf="match.groups.length > 0" class="match-groups">
                <div *ngFor="let group of match.groups; let j = index" class="group-item">
                  <span class="group-label">Group {{ j + 1 }}:</span>
                  <span class="group-value">{{ group }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Reference Section -->
        <div class="card reference-section">
          <h2>Quick Reference</h2>
          <div class="reference-grid">
            <div class="reference-item" (click)="insertPattern('\\d')">
              <code>\\d</code>
              <span>Digit (0-9)</span>
            </div>
            <div class="reference-item" (click)="insertPattern('\\w')">
              <code>\\w</code>
              <span>Word character</span>
            </div>
            <div class="reference-item" (click)="insertPattern('\\s')">
              <code>\\s</code>
              <span>Whitespace</span>
            </div>
            <div class="reference-item" (click)="insertPattern('.')">
              <code>.</code>
              <span>Any character</span>
            </div>
            <div class="reference-item" (click)="insertPattern('^')">
              <code>^</code>
              <span>Start of string</span>
            </div>
            <div class="reference-item" (click)="insertPattern('$')">
              <code>$</code>
              <span>End of string</span>
            </div>
            <div class="reference-item" (click)="insertPattern('*')">
              <code>*</code>
              <span>0 or more</span>
            </div>
            <div class="reference-item" (click)="insertPattern('+')">
              <code>+</code>
              <span>1 or more</span>
            </div>
            <div class="reference-item" (click)="insertPattern('?')">
              <code>?</code>
              <span>0 or 1</span>
            </div>
            <div class="reference-item" (click)="insertPattern('|')">
              <code>|</code>
              <span>OR operator</span>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="card actions-section">
          <h2>Actions</h2>
          <div class="action-buttons">
            <button class="btn btn-secondary w-full" (click)="savePattern()" [disabled]="!pattern || !isAuthenticated">💾 Save Pattern</button>
            <button class="btn btn-secondary w-full" [disabled]="true">📤 Share</button>
            <button class="btn btn-secondary w-full" [disabled]="true">💻 Export Code</button>
            <button class="btn btn-primary w-full" routerLink="/pricing">⭐ Upgrade to Pro</button>
          </div>
          <p *ngIf="!isAuthenticated" class="text-sm text-secondary">Login to save patterns</p>
          <p *ngIf="saveMessage" [class]="saveMessageType === 'success' ? 'text-success' : 'text-error'">{{ saveMessage }}</p>
        </div>
      </div>

      <!-- Common Patterns Section -->
      <div class="card common-patterns">
        <h2>Common Patterns</h2>
        <div class="patterns-grid">
          <div class="pattern-card" (click)="loadPattern(emailPattern, 'test&#64;example.com')">
            <strong>📧 Email</strong>
            <code>{{ emailPatternDisplay }}</code>
          </div>
          <div class="pattern-card" (click)="loadPattern(urlPattern, 'https://example.com')">
            <strong>🔗 URL</strong>
            <code>{{ urlPatternDisplay }}</code>
          </div>
          <div class="pattern-card" (click)="loadPattern(phonePattern, '+1234567890')">
            <strong>📱 Phone</strong>
            <code>{{ phonePatternDisplay }}</code>
          </div>
          <div class="pattern-card" (click)="loadPattern(timePattern, '14:30')">
            <strong>🕐 Time (HH:MM)</strong>
            <code>{{ timePatternDisplay }}</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./regex-tester.component.scss']
})
export class RegexTesterComponent implements OnInit {
  pattern: string = '';
  testString: string = '';
  flags = { i: false, m: false, s: false };
  flagsString: string = '';
  result: RegexTestResponse | null = null;
  loading: boolean = false;

  // Common patterns
  emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  emailPatternDisplay = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  urlPattern = '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})[\\/\\w \\.-]*\\/?$';
  urlPatternDisplay = '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})[\\/\\w \\.-]*\\/?$';
  phonePattern = '^\\+?[1-9]\\d{1,14}$';
  phonePatternDisplay = '^\\+?[1-9]\\d{1,14}$';
  timePattern = '^([01]?\\d|2[0-3]):([0-5]\\d)$';
  timePatternDisplay = '^([01]?\\d|2[0-3]):([0-5]\\d)$';

  private patternChange$ = new Subject<void>();
  private testStringChange$ = new Subject<void>();

  saveMessage: string = '';
  saveMessageType: 'success' | 'error' = 'success';

  constructor(
    private regexService: RegexService,
    private patternService: PatternService,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit() {
    // Debounce pattern and test string changes
    this.patternChange$.pipe(debounceTime(500)).subscribe(() => this.testPattern());
    this.testStringChange$.pipe(debounceTime(500)).subscribe(() => this.testPattern());
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

    this.loading = true;
    const request: RegexTestRequest = {
      pattern: this.pattern,
      testString: this.testString,
      flags: this.flagsString
    };

    this.regexService.testRegex(request).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error testing regex:', error);
        this.loading = false;
      }
    });
  }

  insertPattern(text: string) {
    this.pattern += text;
    this.onPatternChange();
  }

  loadPattern(pattern: string, testString: string) {
    this.pattern = pattern;
    this.testString = testString;
    this.testPattern();
  }

  savePattern() {
    if (!this.pattern) {
      return;
    }

    const patternName = prompt('Enter a name for this pattern:');
    if (!patternName) {
      return;
    }

    const newPattern: RegexPattern = {
      name: patternName,
      pattern: this.pattern,
      flags: this.flagsString,
      description: this.result?.explanation || '',
      isPublic: false
    };

    this.patternService.savePattern(newPattern).subscribe({
      next: () => {
        this.saveMessage = 'Pattern saved successfully!';
        this.saveMessageType = 'success';
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (error) => {
        this.saveMessage = error.error?.message || 'Failed to save pattern. Please try again.';
        this.saveMessageType = 'error';
        setTimeout(() => this.saveMessage = '', 5000);
      }
    });
  }
}
