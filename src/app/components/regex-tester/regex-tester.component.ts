import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegexService, RegexTestRequest, RegexTestResponse } from '../../services/regex.service';
import { PatternService, RegexPattern } from '../../services/pattern.service';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { FolderService, Folder } from '../../services/folder.service';
import { debounceTime, Subject } from 'rxjs';

import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { RegexExplainerComponent } from '../regex-explainer/regex-explainer.component';

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ExportModalComponent, RegexExplainerComponent],
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
            <button class="btn btn-secondary w-full" (click)="clearAll()" title="Clear all fields and start fresh">
              🔄 {{ 'common.clear' | translate }}
            </button>
            <button class="btn btn-secondary w-full" (click)="savePattern()" [disabled]="!pattern || !isAuthenticated">
              💾 {{ loadedPattern ? 'Update Pattern' : ('common.savePattern' | translate) }}
            </button>
            <button
              class="btn btn-secondary w-full"
              (click)="savePatternAsNew()"
              [disabled]="!pattern || !isAuthenticated"
              *ngIf="loadedPattern"
              title="Save as a new pattern (duplicate)">
              📋 Save as New
            </button>
            <button class="btn btn-secondary w-full" [disabled]="true">📤 {{ 'common.share' | translate }}</button>
            <button class="btn btn-secondary w-full" (click)="openExportModal()" [disabled]="!pattern">💻 {{ 'common.exportCode' | translate }}</button>
            <button class="btn btn-primary w-full" routerLink="/pricing" *ngIf="showUpgradeButton">⭐ {{ 'common.upgradeToPro' | translate }}</button>
          </div>
          <p *ngIf="!isAuthenticated" class="text-sm text-secondary">{{ 'common.loginToSave' | translate }}</p>
          <p *ngIf="loadedPattern" class="text-sm text-info">✏️ Editing: {{ loadedPattern.name }}</p>
          <p *ngIf="saveMessage" [class]="saveMessageType === 'success' ? 'text-success' : 'text-error'">{{ saveMessage }}</p>
        </div>
      </div>

      <!-- Regex Explainer -->
      <app-regex-explainer
        *ngIf="pattern && result && result.isValid"
        [pattern]="pattern"
        [flags]="flagsString">
      </app-regex-explainer>

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

      <!-- Export Modal -->
      <app-export-modal
        [isOpen]="showExportModal"
        [pattern]="pattern"
        [flags]="flagsString"
        (closeModal)="closeExportModal()">
      </app-export-modal>

      <!-- Save Pattern Modal with Folder Selection -->
      <div class="modal-overlay" *ngIf="showSavePatternModal" (click)="closeSavePatternModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Save Pattern</h3>
            <button class="modal-close" (click)="closeSavePatternModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Pattern Name</label>
              <input
                type="text"
                [(ngModel)]="newPatternName"
                placeholder="My regex pattern"
                class="form-control"
                (keyup.enter)="confirmSavePattern()">
            </div>
            <div class="form-group" *ngIf="currentTier === 'PRO' && folders.length > 0">
              <label>📁 Folder (Optional)</label>
              <select [(ngModel)]="selectedFolderId" class="form-control">
                <option [ngValue]="null">No folder</option>
                <option *ngFor="let folder of folders" [ngValue]="folder.id">
                  📁 {{ folder.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeSavePatternModal()">Cancel</button>
            <button class="btn btn-primary" (click)="confirmSavePattern()" [disabled]="!newPatternName">Save</button>
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

  // Track loaded pattern for updates
  loadedPattern: RegexPattern | null = null;

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
  currentTier: string = 'FREE';
  showUpgradeButton: boolean = true;
  showExportModal: boolean = false;
  folders: Folder[] = [];
  showSavePatternModal: boolean = false;
  newPatternName: string = '';
  selectedFolderId: number | null = null;

  constructor(
    private regexService: RegexService,
    private patternService: PatternService,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private folderService: FolderService,
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

    // Load subscription tier to determine upgrade button visibility
    if (this.isAuthenticated) {
      this.loadSubscriptionTier();
      this.loadFolders();
    }

    // Check if there's a pattern to load from sessionStorage (from library)
    const patternToLoad = this.patternService.getPatternToLoad();
    if (patternToLoad) {
      this.loadPatternFromLibrary(patternToLoad);
    }
  }

  loadFolders() {
    this.folderService.getFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
      },
      error: (error) => {
        console.error('Error loading folders:', error);
      }
    });
  }

  loadSubscriptionTier() {
    this.subscriptionService.getSubscriptionStatus().subscribe({
      next: (response) => {
        this.currentTier = response.tier || 'FREE';
        this.showUpgradeButton = this.currentTier === 'FREE';
      },
      error: (error) => {
        console.error('Error loading subscription tier:', error);
        this.showUpgradeButton = true;
      }
    });
  }

  private loadPatternFromLibrary(pattern: RegexPattern) {
    // Store the loaded pattern so we can update it instead of creating a duplicate
    this.loadedPattern = pattern;

    this.pattern = pattern.pattern;
    this.testString = pattern.testString || '';

    // Parse flags from pattern
    if (pattern.flags) {
      this.flags.i = pattern.flags.includes('i');
      this.flags.m = pattern.flags.includes('m');
      this.flags.s = pattern.flags.includes('s');
      this.updateFlagsString();
    } else {
      // Reset flags if no flags provided
      this.flags.i = false;
      this.flags.m = false;
      this.flags.s = false;
      this.updateFlagsString();
    }

    // Test pattern after a short delay to ensure UI is ready
    setTimeout(() => {
      this.testPattern();
      this.notificationService.success(`Pattern "${pattern.name}" loaded successfully!`);
    }, 100);
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

  clearAll() {
    this.pattern = '';
    this.testString = '';
    this.flags = { i: false, m: false, s: false };
    this.flagsString = '';
    this.result = null;
    this.loadedPattern = null;
    this.saveMessage = '';
    this.notificationService.success('All fields cleared');
  }

  async savePattern() {
    if (!this.pattern) {
      return;
    }

    if (!this.isAuthenticated) {
      this.notificationService.warning('Please login to save patterns');
      return;
    }

    // If we have a loaded pattern, update it instead of creating new
    if (this.loadedPattern && this.loadedPattern.id) {
      const confirmed = await this.modalService.confirm(
        'Update Pattern',
        `Do you want to update "${this.loadedPattern.name}"? A new version will be saved in history.`,
        'Update',
        'Cancel'
      );

      if (!confirmed) {
        return;
      }

      const updatedPattern: RegexPattern = {
        ...this.loadedPattern,
        pattern: this.pattern,
        testString: this.testString,
        flags: this.flagsString,
        description: this.result?.explanation || this.loadedPattern.description || ''
      };

      this.patternService.updatePattern(this.loadedPattern.id!, updatedPattern).subscribe({
        next: () => {
          this.notificationService.success('Pattern updated successfully! Previous version saved to history.');
          this.loadedPattern = updatedPattern; // Update the loaded pattern reference
        },
        error: (error) => {
          console.error('Error updating pattern:', error);
          this.notificationService.error(error.error?.message || 'Failed to update pattern. Please try again.');
        }
      });
    } else {
      // Create new pattern - show modal
      this.newPatternName = '';
      this.selectedFolderId = null;
      this.showSavePatternModal = true;
    }
  }

  closeSavePatternModal() {
    this.showSavePatternModal = false;
    this.newPatternName = '';
    this.selectedFolderId = null;
  }

  confirmSavePattern() {
    if (!this.newPatternName.trim()) {
      this.notificationService.warning('Please enter a pattern name');
      return;
    }

    const newPattern: RegexPattern = {
      name: this.newPatternName,
      pattern: this.pattern,
      testString: this.testString,
      flags: this.flagsString,
      description: this.result?.explanation || '',
      isPublic: false,
      folderId: this.selectedFolderId || undefined
    };

    this.patternService.savePattern(newPattern).subscribe({
      next: (savedPattern) => {
        this.notificationService.success('Pattern saved successfully!');
        this.loadedPattern = savedPattern;
        this.closeSavePatternModal();
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

  async savePatternAsNew() {
    if (!this.pattern) {
      return;
    }

    if (!this.isAuthenticated) {
      this.notificationService.warning('Please login to save patterns');
      return;
    }

    const patternName = await this.modalService.prompt(
      'Save as New Pattern',
      'Enter a name for this new pattern:',
      this.loadedPattern?.name ? `${this.loadedPattern.name} (copy)` : 'My regex pattern',
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
      testString: this.testString,
      flags: this.flagsString,
      description: this.result?.explanation || '',
      isPublic: false
    };

    this.patternService.savePattern(newPattern).subscribe({
      next: (savedPattern) => {
        this.notificationService.success('Pattern saved as new successfully!');
        this.loadedPattern = savedPattern; // Now tracking the new pattern
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

  openExportModal() {
    if (!this.pattern) {
      this.notificationService.warning('Please enter a regex pattern first');
      return;
    }
    this.showExportModal = true;
  }

  closeExportModal() {
    this.showExportModal = false;
  }
}
