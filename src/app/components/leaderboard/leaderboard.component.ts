import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeaderboardService, LeaderboardEntry, LeaderboardPage } from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leaderboard-container">
      <div class="leaderboard-header">
        <h1>Global Leaderboard</h1>
        <p class="subtitle">Compete with regex enthusiasts worldwide</p>
      </div>

      <div class="tabs">
        <button
          *ngFor="let tab of tabs"
          class="tab"
          [class.active]="selectedTab === tab.value"
          (click)="selectTab(tab.value)">
          {{ tab.label }}
        </button>
      </div>

      <div class="leaderboard-content" *ngIf="!loading">
        <div class="leaderboard-list">
          <div
            *ngFor="let entry of leaderboard; let i = index"
            class="leaderboard-entry"
            [class.top-three]="entry.rank <= 3"
            (click)="viewProfile(entry.username)">

            <div class="rank-section">
              <div class="rank" [class.gold]="entry.rank === 1" [class.silver]="entry.rank === 2" [class.bronze]="entry.rank === 3">
                <span class="medal" *ngIf="entry.rank <= 3">
                  {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉' }}
                </span>
                <span *ngIf="entry.rank > 3">#{{ entry.rank }}</span>
              </div>
            </div>

            <div class="user-info">
              <div class="avatar">{{ getInitials(entry.fullName) }}</div>
              <div class="user-details">
                <h3>{{ entry.fullName }}</h3>
                <p class="username">{{ entry.username }}</p>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat">
                <span class="stat-value">{{ entry.totalPoints }}</span>
                <span class="stat-label">Points</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ entry.challengesCompleted }}</span>
                <span class="stat-label">Challenges</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ entry.patternsShared }}</span>
                <span class="stat-label">Patterns</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ entry.currentStreak }}</span>
                <span class="stat-label">🔥 Streak</span>
              </div>
            </div>

            <div class="badges-section">
              <div class="badge-icon" *ngFor="let badge of entry.badges.slice(0, 5)" [title]="badge.displayName">
                {{ badge.emoji }}
              </div>
              <span class="more-badges" *ngIf="entry.badges.length > 5">
                +{{ entry.badges.length - 5 }}
              </span>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button
            class="page-btn"
            [disabled]="currentPage === 0"
            (click)="goToPage(currentPage - 1)">
            Previous
          </button>
          <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button
            class="page-btn"
            [disabled]="currentPage >= totalPages - 1"
            (click)="goToPage(currentPage + 1)">
            Next
          </button>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading leaderboard...</p>
      </div>

      <div class="empty-state" *ngIf="!loading && leaderboard.length === 0">
        <p>No leaderboard entries found</p>
      </div>
    </div>
  `,
  styles: [`
    .leaderboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .leaderboard-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .leaderboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
    }

    .tabs {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .tab {
      padding: 12px 32px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 25px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 1rem;
    }

    .tab:hover {
      border-color: #f59e0b;
      transform: translateY(-2px);
    }

    .tab.active {
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      color: white;
      border-color: #f59e0b;
    }

    .leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .leaderboard-entry {
      display: grid;
      grid-template-columns: 80px 1fr 2fr 1fr;
      gap: 20px;
      align-items: center;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .leaderboard-entry:hover {
      transform: translateX(8px);
      border-color: #f59e0b;
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
    }

    .leaderboard-entry.top-three {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
      border-color: #f59e0b;
    }

    .rank-section {
      display: flex;
      justify-content: center;
    }

    .rank {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--bg-primary);
      border: 3px solid var(--border-color);
      font-size: 1.3rem;
      font-weight: 700;
    }

    .rank.gold {
      border-color: #fbbf24;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
    }

    .rank.silver {
      border-color: #9ca3af;
      background: linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(107, 114, 128, 0.2) 100%);
    }

    .rank.bronze {
      border-color: #cd7f32;
      background: linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(180, 100, 30, 0.2) 100%);
    }

    .medal {
      font-size: 2rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .user-details h3 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--text-primary);
    }

    .username {
      margin: 4px 0 0 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: var(--bg-primary);
      border-radius: 8px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f59e0b;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .badges-section {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge-icon {
      width: 40px;
      height: 40px;
      background: var(--bg-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border: 2px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .badge-icon:hover {
      transform: scale(1.2);
      border-color: #f59e0b;
    }

    .more-badges {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 32px;
    }

    .page-btn {
      padding: 10px 24px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .page-btn:hover:not(:disabled) {
      border-color: #f59e0b;
      transform: translateY(-2px);
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-weight: 600;
      color: var(--text-primary);
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 20px;
      border: 4px solid var(--border-color);
      border-top-color: #f59e0b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .leaderboard-entry {
        grid-template-columns: 60px 1fr;
        gap: 12px;
      }

      .stats-grid {
        grid-column: 1 / -1;
        grid-template-columns: repeat(4, 1fr);
      }

      .badges-section {
        grid-column: 1 / -1;
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .leaderboard-entry {
        grid-template-columns: 1fr;
        padding: 20px;
      }

      .rank-section {
        justify-content: flex-start;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  tabs = [
    { label: 'All Time', value: 'alltime' },
    { label: 'This Month', value: 'month' },
    { label: 'This Week', value: 'week' }
  ];

  selectedTab = 'alltime';
  leaderboard: LeaderboardEntry[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;
  pageSize = 20;

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.currentPage = 0;
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.loading = true;
    this.leaderboardService.getLeaderboard(this.selectedTab, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: LeaderboardPage) => {
          this.leaderboard = response.content;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading leaderboard:', error);
          this.loading = false;
        }
      });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadLeaderboard();
  }

  viewProfile(username: string) {
    this.router.navigate(['/users', username]);
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
