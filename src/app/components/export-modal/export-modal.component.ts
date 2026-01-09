import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../services/export.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content export-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Export Code</h2>
          <button class="modal-close" (click)="close()">&times;</button>
        </div>

        <div class="modal-body">
          <div class="export-tabs">
            <button
              *ngFor="let lang of languages"
              class="tab-btn"
              [class.active]="selectedLanguage === lang.value"
              (click)="selectLanguage(lang.value)">
              {{ lang.label }}
            </button>
          </div>

          <div class="code-preview" *ngIf="!loading && exportedCode">
            <pre><code>{{ exportedCode }}</code></pre>
          </div>

          <div class="loading-state" *ngIf="loading">
            <p>Generating code...</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="copyCode()" [disabled]="!exportedCode || loading">
            📋 Copy to Clipboard
          </button>
          <button class="btn btn-primary" (click)="downloadCode()" [disabled]="!exportedCode || loading">
            💾 Download File
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .export-modal {
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      background: var(--bg-primary);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease-out;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-primary);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 2rem;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .modal-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .export-tabs {
      display: flex;
      gap: 8px;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-secondary);
    }

    .tab-btn {
      padding: 8px 16px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--accent);
    }

    .tab-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    .code-preview {
      flex: 1;
      overflow: auto;
      padding: 24px;
      background: #1e1e1e;
    }

    .code-preview pre {
      margin: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #d4d4d4;
    }

    .code-preview code {
      display: block;
      white-space: pre;
      word-wrap: normal;
    }

    .loading-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: var(--text-secondary);
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-secondary);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class ExportModalComponent {
  @Input() isOpen = false;
  @Input() pattern = '';
  @Input() flags = '';
  @Output() closeModal = new EventEmitter<void>();

  selectedLanguage = 'javascript';
  exportedCode = '';
  loading = false;

  languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Java', value: 'java' },
    { label: 'Python', value: 'python' }
  ];

  constructor(
    private exportService: ExportService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges() {
    if (this.isOpen && this.pattern) {
      this.generateCode();
    }
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    this.generateCode();
  }

  generateCode() {
    this.loading = true;
    this.exportService.exportCode(this.selectedLanguage, this.pattern, this.flags).subscribe({
      next: (response) => {
        this.exportedCode = response.code;
        this.loading = false;
      },
      error: (error) => {
        console.error('Export error:', error);
        if (error.status === 403) {
          this.notificationService.error('Code export is only available for PRO and TEAM users. Upgrade to unlock this feature!');
        } else {
          this.notificationService.error('Failed to export code. Please try again.');
        }
        this.loading = false;
        this.close();
      }
    });
  }

  copyCode() {
    this.exportService.copyToClipboard(this.exportedCode).then(() => {
      this.notificationService.success('Code copied to clipboard!');
    }).catch(() => {
      this.notificationService.error('Failed to copy code to clipboard');
    });
  }

  downloadCode() {
    const filename = this.getFilename();
    this.exportService.downloadCode(this.exportedCode, filename);
    this.notificationService.success(`Downloaded ${filename}`);
  }

  getFilename(): string {
    const extensions: Record<string, string> = {
      'javascript': 'regex-matcher.js',
      'java': 'RegexMatcher.java',
      'python': 'regex_matcher.py'
    };
    return extensions[this.selectedLanguage] || 'code.txt';
  }

  close() {
    this.closeModal.emit();
  }
}
