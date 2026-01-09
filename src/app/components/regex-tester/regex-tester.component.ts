import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegexService, RegexTestRequest, RegexTestResponse } from '../../services/regex.service';
import { PatternService, RegexPattern } from '../../services/pattern.service';
import { AuthService } from '../../services/auth.service';
import { debounceTime, Subject } from 'rxjs';

import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <div class="container">
      <div class="hero">
        <h1>🔍 {{ 'hero.title' | translate }}</h1>
        <p>{{ 'hero.subtitle' | translate }}</p>
      </div>

      <div class="tester-grid">
        <!-- Pattern Input Section -->
        <div class="card pattern-section">
          <div class="section-header">
            <h2>{{ 'common.regex' | translate }}</h2>
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
              [placeholder]="'common.enterPattern' | translate"
              [class.error]="result && !result.isValid"
            >
            <span class="regex-slash">/{{ flagsString }}</span>
          </div>

          <div *ngIf="result && !result.isValid" class="error-message">
            <strong>❌ {{ 'common.error' | translate }}:</strong> {{ result.error }}
          </div>

          <div *ngIf="result && result.isValid && result.explanation" class="explanation">
            <strong>💡 {{ 'common.explanation' | translate }}:</strong> {{ result.explanation }}
          </div>
        </div>

        <!-- Test String Section -->
        <div class="card test-section">
          <div class="section-header">
            <h2>{{ 'common.testString' | translate }}</h2>
            <div class="match-counter" *ngIf="result && result.isValid">
              <span [class.has-matches]="result.matchCount! > 0">
                {{ result.matchCount }} {{ result.matchCount === 1 ? ('common.match' | translate) : ('common.matches' | translate) }}
              </span>
            </div>
          </div>

          <textarea
            class="test-input"
            [(ngModel)]="testString"
            (ngModelChange)="onTestStringChange()"
            [placeholder]="'common.enterTestString' | translate"
            rows="10"
          ></textarea>

          <div *ngIf="result && result.isValid && result.matchCount! > 0" class="matches-preview">
            <div *ngFor="let match of result.matches; let i = index" class="match-item">
              <div class="match-header">
                <strong>{{ 'common.match' | translate }} {{ i + 1 }}</strong>
                <span class="match-position">[{{ match.start }} - {{ match.end }}]</span>
              </div>
              <div class="match-value">{{ match.fullMatch }}</div>
              <div *ngIf="match.groups.length > 0" class="match-groups">
                <div *ngFor="let group of match.groups; let j = index" class="group-item">
                  <span class="group-label">{{ 'common.group' | translate }} {{ j + 1 }}:</span>
                  <span class="group-value">{{ group }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Reference Section -->
        <div class="card reference-section">
          <h2>{{ 'common.quickReference' | translate }}</h2>
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
          <h2>{{ 'common.actions' | translate }}</h2>
          <div class="action-buttons">
            <button class="btn btn-secondary w-full" (click)="savePattern()" [disabled]="!pattern || !isAuthenticated">💾 {{ 'common.savePattern' | translate }}</button>
            <button class="btn btn-secondary w-full" [disabled]="true">📤 {{ 'common.share' | translate }}</button>
            <button class="btn btn-secondary w-full" [disabled]="true">💻 {{ 'common.exportCode' | translate }}</button>
            <button class="btn btn-primary w-full" routerLink="/pricing">⭐ {{ 'common.upgradeToPro' | translate }}</button>
          </div>
          <p *ngIf="!isAuthenticated" class="text-sm text-secondary">{{ 'common.loginToSave' | translate }}</p>
          <p *ngIf="saveMessage" [class]="saveMessageType === 'success' ? 'text-success' : 'text-error'">{{ saveMessage }}</p>
        </div>
      </div>

      <!-- Common Patterns Section -->
      <div class="card common-patterns">
        <h2>{{ 'common.commonPatterns' | translate }}</h2>
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
    private authService: AuthService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit() {
    // Debounce pattern and test string changes
    this.patternChange$.pipe(debounceTime(500)).subscribe(() => this.testPattern());
    this.testStringChange$.pipe(debounceTime(500)).subscribe(() => this.testPattern());

    // Listen for pattern loaded from library
    this.patternService.selectedPattern$.subscribe(pattern => {
      if (pattern) {
        this.pattern = pattern.pattern;
        this.testString = pattern.testString || '';

        // Parse flags from pattern
        if (pattern.flags) {
          this.flags.i = pattern.flags.includes('i');
          this.flags.m = pattern.flags.includes('m');
          this.flags.s = pattern.flags.includes('s');
          this.updateFlagsString();
        }

        this.testPattern();
        this.patternService.clearSelectedPattern();
        this.notificationService.success(`Pattern "${pattern.name}" loaded successfully!`);
      }
    });
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

  async savePattern() {
    if (!this.pattern) {
      return;
    }

    if (!this.isAuthenticated) {
      this.notificationService.warning('Please login to save patterns');
      return;
    }

    const patternName = await this.modalService.prompt(
      'Save Pattern',
      'Enter a name for this pattern:',
      'My regex pattern',
      '',
      'Save',
      'Cancel'
    );

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
        this.notificationService.success('Pattern saved successfully!');
      },
      error: (error) => {
        console.error('Error saving pattern:', error);
        if (error.status === 403) {
          this.notificationService.error('Authentication failed. Please login again.');
        } else {
          this.notificationService.error(error.error?.message || 'Failed to save pattern. Please try again.');
        }
      }
    });
  }
}
