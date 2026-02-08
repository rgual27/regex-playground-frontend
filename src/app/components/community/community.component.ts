import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommunityService, CommunityPattern, PaginatedPatterns } from '../../services/community.service';
import { PatternRatingComponent } from '../pattern-rating/pattern-rating.component';
import { PatternCommentsComponent } from '../pattern-comments/pattern-comments.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule, PatternRatingComponent, PatternCommentsComponent],
  template: `
    <div class="community-container container">
      <div class="header">
        <h1>Community Pattern Library</h1>
        <p class="subtitle">Browse, rate, and share regex patterns with the community</p>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Sort By:</label>
          <select [(ngModel)]="sortBy" (change)="onFilterChange()">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="topRated">Top Rated</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Category:</label>
          <select [(ngModel)]="category" (change)="onFilterChange()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="filter-group search-group">
          <label>Search:</label>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            placeholder="Search patterns..."
          />
        </div>
      </div>

      <div class="patterns-grid" *ngIf="!isLoading">
        <div class="pattern-card" *ngFor="let pattern of patterns">
          <div class="pattern-header">
            <h3>{{ pattern.name }}</h3>
            <span class="category-badge" *ngIf="pattern.category">{{ pattern.category }}</span>
          </div>

          <div class="pattern-code">
            <code>{{ pattern.pattern }}</code>
          </div>

          <p class="pattern-description" *ngIf="pattern.description">
            {{ pattern.description }}
          </p>

          <div class="pattern-meta">
            <div class="meta-item">
              <span class="icon">👤</span>
              <span>{{ pattern.authorName }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">👁️</span>
              <span>{{ pattern.viewCount }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">💬</span>
              <span>{{ pattern.commentCount }}</span>
            </div>
          </div>

          <div class="pattern-rating">
            <app-pattern-rating
              [patternId]="pattern.id"
              [averageRating]="pattern.averageRating"
              [ratingCount]="pattern.ratingCount"
              [readonly]="false"
              (ratingChanged)="onRatingChanged()"
            ></app-pattern-rating>
          </div>

          <div class="pattern-actions">
            <button class="btn btn-secondary btn-sm" (click)="tryPattern(pattern)">
              Try It
            </button>
            <button class="btn btn-primary btn-sm" (click)="forkPattern(pattern)">
              Fork
            </button>
            <button class="btn btn-secondary btn-sm" (click)="toggleComments(pattern.id)">
              {{ expandedComments.has(pattern.id) ? 'Hide' : 'Show' }} Comments
            </button>
          </div>

          <div class="pattern-comments" *ngIf="expandedComments.has(pattern.id)">
            <app-pattern-comments [patternId]="pattern.id"></app-pattern-comments>
          </div>
        </div>

        <div class="no-patterns" *ngIf="patterns.length === 0">
          <p>No patterns found. Try adjusting your filters.</p>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading patterns...</p>
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
  `,
  styles: [`
    .community-container {
      padding: 2rem 0;
      max-width: 1200px;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .filters {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 150px;
    }

    .search-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9rem;
    }

    .filter-group select,
    .filter-group input {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 0.95rem;
      background-color: var(--bg-primary);
    }

    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .pattern-card {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: all 0.3s;
    }

    .pattern-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .pattern-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .pattern-header h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.25rem;
      flex: 1;
      word-break: break-word;
    }

    .category-badge {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .pattern-code {
      background-color: var(--bg-primary);
      padding: 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
      overflow-x: auto;
    }

    .pattern-code code {
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
      color: var(--text-primary);
      word-break: break-all;
    }

    .pattern-description {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .pattern-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .icon {
      font-size: 1rem;
    }

    .pattern-rating {
      margin-bottom: 1rem;
    }

    .pattern-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .pattern-comments {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .no-patterns {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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

    @media (max-width: 768px) {
      .patterns-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
      }

      .pattern-actions {
        flex-direction: column;
      }

      .pattern-actions button {
        width: 100%;
      }
    }
  `]
})
export class CommunityComponent implements OnInit {
  patterns: CommunityPattern[] = [];
  categories: string[] = [];
  sortBy: string = 'recent';
  category: string = '';
  searchTerm: string = '';
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  isLoading: boolean = false;
  expandedComments: Set<number> = new Set();

  private searchTimeout: any;

  constructor(
    private communityService: CommunityService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPatterns();
  }

  loadCategories(): void {
    this.communityService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadPatterns(): void {
    this.isLoading = true;
    this.communityService.getPublicPatterns(
      this.currentPage,
      20,
      this.sortBy,
      this.category || undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (response: PaginatedPatterns) => {
        this.patterns = response.patterns;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patterns:', error);
        this.notificationService.show('Failed to load patterns', 'error');
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadPatterns();
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadPatterns();
    }, 500);
  }

  loadPage(page: number): void {
    this.currentPage = page;
    this.loadPatterns();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tryPattern(pattern: CommunityPattern): void {
    // Navigate to main tester with pattern loaded
    this.router.navigate(['/'], {
      state: {
        pattern: pattern.pattern,
        flags: pattern.flags,
        testString: ''
      }
    });
  }

  forkPattern(pattern: CommunityPattern): void {
    if (!this.authService.currentUserValue) {
      this.notificationService.show('Please log in to fork patterns', 'info');
      return;
    }

    this.communityService.forkPattern(pattern.id).subscribe({
      next: (response) => {
        this.notificationService.show('Pattern forked successfully! Check your library.', 'success');
      },
      error: (error) => {
        console.error('Error forking pattern:', error);
        this.notificationService.show('Failed to fork pattern', 'error');
      }
    });
  }

  toggleComments(patternId: number): void {
    if (this.expandedComments.has(patternId)) {
      this.expandedComments.delete(patternId);
    } else {
      this.expandedComments.add(patternId);
    }
  }

  onRatingChanged(): void {
    // Reload patterns to get updated ratings
    this.loadPatterns();
  }
}
