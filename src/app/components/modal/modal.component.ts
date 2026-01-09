import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="modal" (click)="onOverlayClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" (click)="cancel()">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ modal.message }}</p>
          <input
            *ngIf="modal.type === 'prompt'"
            type="text"
            class="modal-input"
            [(ngModel)]="inputValue"
            [placeholder]="modal.inputPlaceholder || ''"
            (keydown.enter)="confirm()"
            (keydown.escape)="cancel()"
            #inputElement>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cancel()">
            {{ modal.cancelText || 'Cancel' }}
          </button>
          <button class="btn btn-primary" (click)="confirm()">
            {{ modal.confirmText || 'Confirm' }}
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
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
      backdrop-filter: blur(4px);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 28px;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s;
      line-height: 1;
    }

    .modal-close:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 24px;
    }

    .modal-body p {
      margin: 0 0 16px 0;
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 15px;
    }

    .modal-input {
      width: 100%;
      padding: 12px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 15px;
      font-family: inherit;
      transition: all 0.2s;
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .modal-input:focus {
      outline: none;
      border-color: var(--primary-color);
      background: var(--bg-primary);
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid var(--border-color);
    }

    .modal-footer .btn {
      min-width: 100px;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 10px;
      }

      .modal-footer {
        flex-direction: column-reverse;
      }

      .modal-footer .btn {
        width: 100%;
      }
    }
  `]
})
export class ModalComponent implements OnInit {
  modal: ModalConfig | null = null;
  inputValue = '';

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.getModal().subscribe(modal => {
      this.modal = modal;
      if (modal && modal.type === 'prompt') {
        this.inputValue = modal.inputValue || '';
        // Auto-focus input after view renders
        setTimeout(() => {
          const input = document.querySelector('.modal-input') as HTMLInputElement;
          if (input) {
            input.focus();
            input.select();
          }
        }, 100);
      }
    });
  }

  confirm() {
    if (this.modal) {
      this.modalService.resolve(
        this.modal.id,
        true,
        this.modal.type === 'prompt' ? this.inputValue : undefined
      );
    }
  }

  cancel() {
    if (this.modal) {
      this.modalService.resolve(this.modal.id, false);
    }
  }

  onOverlayClick() {
    this.cancel();
  }
}
