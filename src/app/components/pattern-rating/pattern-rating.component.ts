import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../../services/community.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pattern-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-container">
      <div class="stars" [class.interactive]="!readonly">
        <span
          *ngFor="let star of stars; let i = index"
          class="star"
          [class.filled]="i < (hoverRating || currentRating)"
          [class.readonly]="readonly"
          (mouseenter)="onStarHover(i + 1)"
          (mouseleave)="onStarLeave()"
          (click)="onStarClick(i + 1)"
        >
          {{ i < (hoverRating || currentRating) ? '★' : '☆' }}
        </span>
      </div>
      <div class="rating-info">
        <span class="average">{{ averageRating.toFixed(1) }}</span>
        <span class="count" *ngIf="ratingCount > 0">({{ ratingCount }} {{ ratingCount === 1 ? 'rating' : 'ratings' }})</span>
      </div>
    </div>
  `,
  styles: [`
    .rating-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .stars {
      display: flex;
      gap: 0.25rem;
    }

    .stars.interactive .star {
      cursor: pointer;
      transition: all 0.2s;
    }

    .stars.interactive .star:hover {
      transform: scale(1.2);
    }

    .star {
      font-size: 1.5rem;
      color: #d1d5db;
      user-select: none;
    }

    .star.filled {
      color: #fbbf24;
    }

    .star.readonly {
      cursor: default;
    }

    .rating-info {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .average {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .count {
      color: var(--text-secondary);
    }
  `]
})
export class PatternRatingComponent implements OnInit {
  @Input() patternId!: number;
  @Input() averageRating: number = 0;
  @Input() ratingCount: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChanged = new EventEmitter<void>();

  stars = [1, 2, 3, 4, 5];
  currentRating: number = 0;
  hoverRating: number = 0;

  constructor(
    private communityService: CommunityService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (!this.readonly && this.authService.currentUserValue) {
      this.loadUserRating();
    }
  }

  loadUserRating(): void {
    this.communityService.getUserRating(this.patternId).subscribe({
      next: (response) => {
        if (response.hasRated && response.rating) {
          this.currentRating = response.rating;
        }
      },
      error: (error) => {
        console.error('Error loading user rating:', error);
      }
    });
  }

  onStarHover(rating: number): void {
    if (!this.readonly && this.authService.currentUserValue) {
      this.hoverRating = rating;
    }
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }

  onStarClick(rating: number): void {
    if (this.readonly) return;

    if (!this.authService.currentUserValue) {
      this.notificationService.show('Please log in to rate patterns', 'info');
      return;
    }

    this.communityService.ratePattern(this.patternId, rating).subscribe({
      next: (response) => {
        this.currentRating = rating;
        this.averageRating = response.averageRating;
        this.ratingCount = response.ratingCount;
        this.notificationService.show('Rating saved successfully!', 'success');
        this.ratingChanged.emit();
      },
      error: (error) => {
        console.error('Error rating pattern:', error);
        this.notificationService.show('Failed to save rating', 'error');
      }
    });
  }
}
