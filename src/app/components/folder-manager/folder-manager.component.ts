import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FolderService, Folder } from '../../services/folder.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-folder-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="folder-manager">
      <div class="header">
        <h2>{{ 'folders.title' | translate }}</h2>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          <span class="icon">+</span> {{ 'folders.create' | translate }}
        </button>
      </div>

      <div class="folders-grid" *ngIf="folders.length > 0">
        <div
          *ngFor="let folder of folders"
          class="folder-card"
          [style.border-color]="folder.color">
          <div class="folder-header" [style.background]="folder.color + '20'">
            <div class="folder-icon" [style.color]="folder.color">📁</div>
            <h3>{{ folder.name }}</h3>
          </div>
          <p class="description" *ngIf="folder.description">{{ folder.description }}</p>
          <div class="folder-stats">
            <span class="pattern-count">
              {{ folder.patternCount || 0 }} {{ 'folders.patterns' | translate }}
            </span>
          </div>
          <div class="actions">
            <button class="btn-icon" (click)="editFolder(folder)" title="{{ 'common.edit' | translate }}">
              ✏️
            </button>
            <button class="btn-icon" (click)="confirmDelete(folder)" title="{{ 'common.delete' | translate }}">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="folders.length === 0 && !loading">
        <div class="empty-icon">📂</div>
        <h3>{{ 'folders.empty.title' | translate }}</h3>
        <p>{{ 'folders.empty.description' | translate }}</p>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          {{ 'folders.create' | translate }}
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal || editingFolder" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingFolder ? ('folders.edit' | translate) : ('folders.create' | translate) }}</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveFolder()">
            <div class="form-group">
              <label>{{ 'folders.name' | translate }}</label>
              <input
                type="text"
                [(ngModel)]="folderForm.name"
                name="name"
                class="form-control"
                placeholder="Work Projects"
                required>
            </div>
            <div class="form-group">
              <label>{{ 'folders.description' | translate }}</label>
              <textarea
                [(ngModel)]="folderForm.description"
                name="description"
                class="form-control"
                placeholder="Optional description"
                rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>{{ 'folders.color' | translate }}</label>
              <div class="color-picker">
                <div
                  *ngFor="let color of colorOptions"
                  class="color-option"
                  [class.selected]="folderForm.color === color"
                  [style.background]="color"
                  (click)="folderForm.color = color">
                  <span *ngIf="folderForm.color === color">✓</span>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">
                {{ 'common.cancel' | translate }}
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="saving || !folderForm.name">
                {{ saving ? ('common.saving' | translate) : ('common.save' | translate) }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="deletingFolder" (click)="deletingFolder = null">
        <div class="modal modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'folders.deleteConfirm' | translate }}</h3>
            <button class="close-btn" (click)="deletingFolder = null">×</button>
          </div>
          <p>Are you sure you want to delete this folder? Patterns inside will not be deleted.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="deletingFolder = null">
              {{ 'common.cancel' | translate }}
            </button>
            <button class="btn btn-danger" (click)="deleteFolder()" [disabled]="saving">
              {{ saving ? ('common.deleting' | translate) : ('common.delete' | translate) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .folder-manager {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        margin: 0;
      }
    }

    .folders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .folder-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;
      position: relative;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }
    }

    .folder-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      border-radius: 8px;

      .folder-icon {
        font-size: 1.5rem;
      }

      h3 {
        margin: 0;
        font-size: 1.125rem;
      }
    }

    .description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      min-height: 2.5rem;
    }

    .folder-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--border-color);
      margin-bottom: 0.75rem;

      .pattern-count {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-icon {
      background: transparent;
      border: 1px solid var(--border-color);
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-secondary);
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }
    }

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
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;

      &.modal-sm {
        max-width: 400px;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

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

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      textarea.form-control {
        resize: vertical;
        font-family: inherit;
      }
    }

    .color-picker {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
    }

    .color-option {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 1.25rem;
      color: white;

      &:hover {
        transform: scale(1.1);
      }

      &.selected {
        border-color: var(--text-primary);
        box-shadow: var(--shadow-md);
      }
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-danger {
      background: #ef4444;
      color: white;

      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }

    @media (max-width: 768px) {
      .folder-manager {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .folders-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FolderManagerComponent implements OnInit {
  folders: Folder[] = [];
  loading = false;
  saving = false;
  showCreateModal = false;
  editingFolder: Folder | null = null;
  deletingFolder: Folder | null = null;

  folderForm: Folder = {
    name: '',
    description: '',
    color: '#3b82f6'
  };

  colorOptions = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // green
    '#06b6d4', // cyan
    '#6366f1', // indigo
    '#f97316', // orange
    '#14b8a6', // teal
    '#84cc16', // lime
    '#64748b'  // slate
  ];

  constructor(
    private folderService: FolderService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadFolders();
  }

  loadFolders() {
    this.loading = true;
    this.folderService.getFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading folders:', error);
        this.notificationService.error('Failed to load folders');
        this.loading = false;
      }
    });
  }

  editFolder(folder: Folder) {
    this.editingFolder = folder;
    this.folderForm = { ...folder };
  }

  confirmDelete(folder: Folder) {
    this.deletingFolder = folder;
  }

  closeModal() {
    this.showCreateModal = false;
    this.editingFolder = null;
    this.folderForm = {
      name: '',
      description: '',
      color: '#3b82f6'
    };
  }

  saveFolder() {
    if (!this.folderForm.name.trim()) {
      this.notificationService.warning('Please enter a folder name');
      return;
    }

    this.saving = true;
    const operation = this.editingFolder
      ? this.folderService.updateFolder(this.editingFolder.id!, this.folderForm)
      : this.folderService.createFolder(this.folderForm);

    operation.subscribe({
      next: () => {
        this.notificationService.success(
          this.editingFolder ? 'Folder updated successfully' : 'Folder created successfully'
        );
        this.closeModal();
        this.loadFolders();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving folder:', error);
        this.notificationService.error(error.error?.message || 'Failed to save folder');
        this.saving = false;
      }
    });
  }

  deleteFolder() {
    if (!this.deletingFolder?.id) return;

    this.saving = true;
    this.folderService.deleteFolder(this.deletingFolder.id).subscribe({
      next: () => {
        this.notificationService.success('Folder deleted successfully');
        this.deletingFolder = null;
        this.loadFolders();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error deleting folder:', error);
        this.notificationService.error(error.error?.message || 'Failed to delete folder');
        this.saving = false;
      }
    });
  }
}
