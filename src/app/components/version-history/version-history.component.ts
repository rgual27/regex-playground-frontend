import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatternService, PatternVersion } from '../../services/pattern.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-version-history',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="version-history" *ngIf="show">
      <div class="modal-overlay" (click)="close()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'versions.title' | translate }}</h3>
            <button class="close-btn" (click)="close()">×</button>
          </div>

          <div class="versions-list" *ngIf="versions.length > 0">
            <div *ngFor="let version of versions; let i = index" class="version-item">
              <div class="version-header">
                <div class="version-number">
                  <span class="badge" [class.badge-current]="i === 0">
                    v{{ version.version }}
                  </span>
                  <span class="current-label" *ngIf="i === 0">
                    {{ 'versions.current' | translate }}
                  </span>
                </div>
                <div class="version-date">
                  {{ version.createdAt | date:'short' }}
                </div>
              </div>

              <div class="version-details">
                <div class="detail-row">
                  <label>{{ 'versions.pattern' | translate }}:</label>
                  <code class="pattern-code">{{ version.patternContent }}</code>
                </div>

                <div class="detail-row" *ngIf="version.flags">
                  <label>{{ 'versions.flags' | translate }}:</label>
                  <span class="flags">{{ version.flags }}</span>
                </div>

                <div class="detail-row" *ngIf="version.changeNote">
                  <label>{{ 'versions.changes' | translate }}:</label>
                  <p class="change-note">{{ version.changeNote }}</p>
                </div>
              </div>

              <div class="version-actions">
                <button
                  class="btn btn-sm btn-secondary"
                  (click)="restoreVersion(version)"
                  *ngIf="i !== 0"
                  [disabled]="restoring">
                  {{ restoring ? ('common.restoring' | translate) : ('versions.restore' | translate) }}
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="versions.length === 0 && !loading">
            <div class="empty-icon">📜</div>
            <p>{{ 'versions.noHistory' | translate }}</p>
          </div>

          <div class="loading-state" *ngIf="loading">
            <div class="spinner"></div>
            <p>{{ 'common.loading' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 700px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);

      h3 {
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: var(--text-primary);
        }
      }
    }

    .versions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .version-item {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.25rem;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-md);
      }
    }

    .version-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .version-number {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 600;
        background: var(--bg-tertiary);
        color: var(--text-secondary);

        &.badge-current {
          background: var(--primary-color);
          color: white;
        }
      }

      .current-label {
        font-size: 0.75rem;
        color: var(--primary-color);
        font-weight: 500;
        text-transform: uppercase;
      }
    }

    .version-date {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .version-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--text-secondary);
        letter-spacing: 0.5px;
      }

      .pattern-code {
        padding: 0.75rem;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        color: var(--primary-color);
        word-break: break-all;
      }

      .flags {
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        color: var(--text-primary);
      }

      .change-note {
        margin: 0;
        padding: 0.75rem;
        background: var(--bg-primary);
        border-left: 3px solid var(--primary-color);
        border-radius: 4px;
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.5;
      }
    }

    .version-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .loading-state {
      text-align: center;
      padding: 3rem 1rem;

      .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto 1rem;
        border: 4px solid var(--bg-tertiary);
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      p {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .modal {
        width: 95%;
        padding: 1.5rem;
        max-height: 90vh;
      }

      .version-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class VersionHistoryComponent {
  @Input() patternId: number | null = null;
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();
  @Output() versionRestored = new EventEmitter<PatternVersion>();

  versions: PatternVersion[] = [];
  loading = false;
  restoring = false;

  constructor(
    private patternService: PatternService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges() {
    if (this.show && this.patternId) {
      this.loadVersions();
    }
  }

  loadVersions() {
    if (!this.patternId) return;

    this.loading = true;
    this.patternService.getPatternVersions(this.patternId).subscribe({
      next: (versions) => {
        this.versions = versions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading version history:', error);
        this.notificationService.error('Failed to load version history');
        this.loading = false;
      }
    });
  }

  restoreVersion(version: PatternVersion) {
    this.restoring = true;
    // Emit the version to parent component to handle restoration
    this.versionRestored.emit(version);
    this.notificationService.success('Pattern restored to version ' + version.version);
    this.restoring = false;
    this.close();
  }

  close() {
    this.closed.emit();
  }
}
