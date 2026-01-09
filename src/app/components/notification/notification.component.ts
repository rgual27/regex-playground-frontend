import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications"
        class="notification"
        [class.success]="notification.type === 'success'"
        [class.error]="notification.type === 'error'"
        [class.info]="notification.type === 'info'"
        [class.warning]="notification.type === 'warning'">
        <div class="notification-icon">
          <span *ngIf="notification.type === 'success'">✓</span>
          <span *ngIf="notification.type === 'error'">✕</span>
          <span *ngIf="notification.type === 'info'">ℹ</span>
          <span *ngIf="notification.type === 'warning'">⚠</span>
        </div>
        <div class="notification-message">{{ notification.message }}</div>
        <button class="notification-close" (click)="close(notification.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: white;
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification.success {
      border-left-color: #10b981;
      background: #f0fdf4;
    }

    .notification.success .notification-icon {
      color: #10b981;
      background: #d1fae5;
    }

    .notification.error {
      border-left-color: #ef4444;
      background: #fef2f2;
    }

    .notification.error .notification-icon {
      color: #ef4444;
      background: #fee2e2;
    }

    .notification.info {
      border-left-color: #3b82f6;
      background: #eff6ff;
    }

    .notification.info .notification-icon {
      color: #3b82f6;
      background: #dbeafe;
    }

    .notification.warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }

    .notification.warning .notification-icon {
      color: #f59e0b;
      background: #fef3c7;
    }

    .notification-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
    }

    .notification-message {
      flex: 1;
      font-size: 14px;
      color: #1f2937;
      line-height: 1.5;
    }

    .notification-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      font-size: 20px;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      flex-shrink: 0;
      transition: all 0.2s;
      line-height: 1;
    }

    .notification-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #1f2937;
    }

    @media (max-width: 768px) {
      .notification-container {
        top: 70px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .notification {
        min-width: auto;
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  close(id: string) {
    this.notificationService.remove(id);
  }
}
