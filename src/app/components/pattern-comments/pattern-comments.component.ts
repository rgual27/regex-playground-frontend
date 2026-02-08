import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityService, Comment, PaginatedComments } from '../../services/community.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pattern-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comments-container">
      <h3>Comments ({{ totalComments }})</h3>

      <div class="add-comment" *ngIf="currentUser">
        <textarea
          [(ngModel)]="newComment"
          placeholder="Add a comment..."
          rows="3"
        ></textarea>
        <button
          class="btn btn-primary"
          (click)="submitComment()"
          [disabled]="!newComment.trim() || isSubmitting"
        >
          {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </div>

      <div class="login-prompt" *ngIf="!currentUser">
        <p>Please log in to comment</p>
      </div>

      <div class="comments-list">
        <div class="comment" *ngFor="let comment of comments">
          <div class="comment-header">
            <span class="author">{{ comment.userName }}</span>
            <span class="date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-body">
            {{ comment.comment }}
          </div>
          <div class="comment-footer" *ngIf="comment.updatedAt !== comment.createdAt">
            <span class="edited">Edited {{ formatDate(comment.updatedAt) }}</span>
          </div>
        </div>

        <div class="no-comments" *ngIf="comments.length === 0 && !isLoading">
          <p>No comments yet. Be the first to comment!</p>
        </div>

        <div class="loading" *ngIf="isLoading">
          <p>Loading comments...</p>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button
            class="btn btn-secondary"
            (click)="loadPage(currentPage - 1)"
            [disabled]="currentPage === 0"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button
            class="btn btn-secondary"
            (click)="loadPage(currentPage + 1)"
            [disabled]="currentPage >= totalPages - 1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comments-container {
      margin-top: 2rem;
    }

    h3 {
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .add-comment {
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .add-comment textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-family: inherit;
      resize: vertical;
      font-size: 0.95rem;
    }

    .add-comment textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .add-comment button {
      align-self: flex-end;
    }

    .login-prompt {
      padding: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      text-align: center;
      margin-bottom: 2rem;
      color: var(--text-secondary);
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .comment {
      padding: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .author {
      font-weight: 600;
      color: var(--text-primary);
    }

    .date {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .comment-body {
      color: var(--text-primary);
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .comment-footer {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }

    .edited {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-style: italic;
    }

    .no-comments {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .page-info {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class PatternCommentsComponent implements OnInit {
  @Input() patternId!: number;

  comments: Comment[] = [];
  newComment: string = '';
  currentPage: number = 0;
  totalPages: number = 0;
  totalComments: number = 0;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  currentUser: any;

  constructor(
    private communityService: CommunityService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.communityService.getComments(this.patternId, this.currentPage).subscribe({
      next: (response: PaginatedComments) => {
        this.comments = response.comments;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalComments = response.totalItems;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.notificationService.show('Failed to load comments', 'error');
        this.isLoading = false;
      }
    });
  }

  loadPage(page: number): void {
    this.currentPage = page;
    this.loadComments();
  }

  submitComment(): void {
    if (!this.newComment.trim()) return;

    this.isSubmitting = true;
    this.communityService.addComment(this.patternId, this.newComment).subscribe({
      next: (response) => {
        this.notificationService.show('Comment posted successfully!', 'success');
        this.newComment = '';
        this.currentPage = 0;
        this.loadComments();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error posting comment:', error);
        this.notificationService.show('Failed to post comment', 'error');
        this.isSubmitting = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  }
}
