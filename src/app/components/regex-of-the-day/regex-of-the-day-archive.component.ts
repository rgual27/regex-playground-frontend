import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegexOfTheDayService, RegexOfTheDay, RegexOfTheDayPage } from '../../services/regex-of-the-day.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-regex-of-the-day-archive',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="archive-container">
      <div class="archive-header">
        <h1>📅 Regex of the Day Archive</h1>
        <p>Browse through our collection of curated regex patterns</p>
        <a routerLink="/regex-of-the-day" class="btn-back">← Back to Today</a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading archive...</p>
      </div>

      <!-- Archive Grid -->
      <div *ngIf="!loading && patterns.length > 0" class="archive-grid">
        <div *ngFor="let pattern of patterns" class="archive-card" [routerLink]="['/regex-of-the-day']" [queryParams]="{date: pattern.date}">
          <div class="card-header">
            <span class="card-date">{{ formatDate(pattern.date) }}</span>
            <span class="card-difficulty" [ngClass]="getDifficultyClass(pattern.difficulty)">
              {{ getDifficultyIcon(pattern.difficulty) }} {{ pattern.difficulty }}
            </span>
          </div>

          <h3 class="card-title">{{ pattern.title }}</h3>
          <p class="card-description">{{ pattern.description }}</p>

          <div class="card-pattern">
            <code>/{{ truncatePattern(pattern.pattern) }}/{{ pattern.flags || '' }}</code>
          </div>

          <div class="card-meta">
            <span class="meta-item">
              <span class="meta-icon">{{ getCategoryIcon(pattern.category) }}</span>
              {{ pattern.category }}
            </span>
          </div>

          <div class="card-stats">
            <span class="stat-item">
              <span class="stat-icon">❤️</span>
              {{ pattern.likes }}
            </span>
            <span class="stat-item">
              <span class="stat-icon">🔗</span>
              {{ pattern.shares }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && patterns.length > 0" class="pagination">
        <button
          class="btn-page"
          (click)="goToPage(currentPage - 1)"
          [disabled]="currentPage === 0">
          ← Previous
        </button>

        <div class="page-info">
          Page {{ currentPage + 1 }} of {{ totalPages }}
        </div>

        <button
          class="btn-page"
          (click)="goToPage(currentPage + 1)"
          [disabled]="currentPage >= totalPages - 1">
          Next →
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && patterns.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h2>No Patterns Yet</h2>
        <p>The archive is empty. Check back soon for curated regex patterns!</p>
      </div>
    </div>
  `,
  styles: [`
    .archive-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .archive-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 1.5rem;
      }

      .btn-back {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #f8f9fa;
        color: #495057;
        text-decoration: none;
        border-radius: 8px;
        border: 2px solid #dee2e6;
        font-weight: 600;
        transition: all 0.2s;

        &:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }
      }
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4a90e2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      p {
        color: #666;
        font-size: 1.1rem;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .archive-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .archive-card {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover {
        border-color: #667eea;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        transform: translateY(-4px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.5rem;

        .card-date {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .card-difficulty {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;

          &.difficulty-beginner {
            background: #e8f5e9;
            color: #388e3c;
          }

          &.difficulty-intermediate {
            background: #fff3e0;
            color: #f57c00;
          }

          &.difficulty-advanced {
            background: #ffebee;
            color: #d32f2f;
          }
        }
      }

      .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0 0 0.75rem 0;
        line-height: 1.3;
      }

      .card-description {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .card-pattern {
        background: #f8f9fa;
        border: 2px solid #dee2e6;
        border-radius: 6px;
        padding: 0.75rem;
        margin-bottom: 1rem;

        code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9rem;
          color: #c7254e;
          word-break: break-all;
        }
      }

      .card-meta {
        margin-bottom: 1rem;

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;

          .meta-icon {
            font-size: 1rem;
          }
        }
      }

      .card-stats {
        display: flex;
        gap: 1.5rem;
        padding-top: 1rem;
        border-top: 2px solid #e9ecef;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;

          .stat-icon {
            font-size: 1rem;
          }
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-top: 3rem;

      .btn-page {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      }

      .page-info {
        font-weight: 600;
        color: #555;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h2 {
        font-size: 2rem;
        color: #333;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.1rem;
        color: #666;
      }
    }
  `]
})
export class RegexOfTheDayArchiveComponent implements OnInit {
  patterns: RegexOfTheDay[] = [];
  loading: boolean = true;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 12;

  constructor(
    private rotdService: RegexOfTheDayService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadArchive(0);
  }

  loadArchive(page: number) {
    this.loading = true;
    this.rotdService.getArchive(page, this.pageSize).subscribe({
      next: (response: RegexOfTheDayPage) => {
        this.patterns = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading archive:', error);
        this.notificationService.error('Failed to load archive');
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadArchive(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty.toLowerCase()}`;
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'BEGINNER':
        return '🟢';
      case 'INTERMEDIATE':
        return '🟡';
      case 'ADVANCED':
        return '🔴';
      default:
        return '⚪';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Validation':
        return '✅';
      case 'Extraction':
        return '🔍';
      case 'Search':
        return '🔎';
      case 'Formatting':
        return '📝';
      case 'Data Cleaning':
        return '🧹';
      default:
        return '📋';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  truncatePattern(pattern: string): string {
    return pattern.length > 40 ? pattern.substring(0, 40) + '...' : pattern;
  }
}
