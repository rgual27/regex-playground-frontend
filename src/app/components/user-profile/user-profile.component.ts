import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LeaderboardService, UserProfile, Badge } from '../../services/leaderboard.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="!loading && profile">
      <div class="profile-header">
        <div class="header-content">
          <div class="avatar-large">{{ getInitials(profile.fullName) }}</div>
          <div class="header-info">
            <h1>{{ profile.fullName }}</h1>
            <p class="username">{{ profile.username }}</p>
            <div class="rank-badge">
              <span class="rank-icon">🏆</span>
              <span>Rank #{{ profile.rank }}</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="share-btn" (click)="shareProfile()">
              <span>🔗</span> Share Profile
            </button>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <span class="stat-value">{{ profile.totalPoints }}</span>
              <span class="stat-label">Total Points</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <span class="stat-value">{{ profile.challengesCompleted }}</span>
              <span class="stat-label">Challenges Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌟</div>
            <div class="stat-content">
              <span class="stat-value">{{ profile.patternsShared }}</span>
              <span class="stat-label">Patterns Shared</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <span class="stat-value">{{ profile.patternsSaved }}</span>
              <span class="stat-label">Patterns Saved</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <span class="stat-value">{{ profile.currentStreak }}</span>
              <span class="stat-label">Current Streak</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏅</div>
            <div class="stat-content">
              <span class="stat-value">{{ profile.longestStreak }}</span>
              <span class="stat-label">Longest Streak</span>
            </div>
          </div>
        </div>
      </div>

      <div class="badges-section" *ngIf="profile.badges.length > 0">
        <h2>Badges & Achievements</h2>
        <div class="badges-grid">
          <div class="badge-card" *ngFor="let badge of profile.badges">
            <div class="badge-emoji">{{ badge.emoji }}</div>
            <h3>{{ badge.displayName }}</h3>
            <p class="badge-description">{{ badge.description }}</p>
            <span class="earned-date" *ngIf="badge.earnedAt">
              Earned {{ formatDate(badge.earnedAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="patterns-section" *ngIf="profile.recentPatterns.length > 0">
        <h2>Public Patterns</h2>
        <div class="patterns-list">
          <div class="pattern-card" *ngFor="let pattern of profile.recentPatterns">
            <div class="pattern-header">
              <h3>{{ pattern.name }}</h3>
              <div class="pattern-stats">
                <span>👁️ {{ pattern.viewCount }}</span>
                <span>🔗 {{ pattern.shareCount }}</span>
              </div>
            </div>
            <p class="pattern-description">{{ pattern.description }}</p>
            <code class="pattern-code">{{ pattern.pattern }}</code>
            <span class="created-date">Created {{ formatDate(pattern.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div class="challenges-section" *ngIf="profile.recentChallenges.length > 0">
        <h2>Challenge History</h2>
        <div class="challenges-list">
          <div class="challenge-card" *ngFor="let challenge of profile.recentChallenges">
            <div class="challenge-info">
              <h3>{{ challenge.challengeName }}</h3>
              <span class="difficulty-badge" [class]="challenge.difficulty">
                {{ challenge.difficulty }}
              </span>
            </div>
            <div class="challenge-points">
              +{{ challenge.pointsEarned }} pts
            </div>
            <span class="completed-date">{{ formatDate(challenge.completedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="member-since">
        <p>Member since {{ formatDate(profile.joinedAt) }}</p>
      </div>
    </div>

    <div class="loading-state" *ngIf="loading">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>

    <div class="error-state" *ngIf="error">
      <p>{{ error }}</p>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .profile-header {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
      border: 2px solid var(--border-color);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 40px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 2.5rem;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .header-info {
      flex: 1;
      min-width: 200px;
    }

    .header-info h1 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      color: var(--text-primary);
    }

    .username {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      color: var(--text-secondary);
    }

    .rank-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: var(--bg-primary);
      border: 2px solid #f59e0b;
      border-radius: 20px;
      font-weight: 600;
      color: #f59e0b;
    }

    .rank-icon {
      font-size: 1.2rem;
    }

    .header-actions {
      margin-left: auto;
    }

    .share-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
    }

    .share-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    .stats-section, .badges-section, .patterns-section, .challenges-section {
      margin-bottom: 40px;
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 24px;
      color: var(--text-primary);
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border-color);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: #f59e0b;
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #f59e0b;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .badges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .badge-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .badge-card:hover {
      border-color: #f59e0b;
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .badge-emoji {
      font-size: 3rem;
      margin-bottom: 12px;
    }

    .badge-card h3 {
      font-size: 1.2rem;
      margin: 0 0 8px 0;
      color: var(--text-primary);
    }

    .badge-description {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0 0 12px 0;
    }

    .earned-date {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-style: italic;
    }

    .patterns-list, .challenges-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pattern-card, .challenge-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .pattern-card:hover, .challenge-card:hover {
      border-color: #f59e0b;
      transform: translateX(8px);
    }

    .pattern-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .pattern-header h3 {
      margin: 0;
      font-size: 1.3rem;
      color: var(--text-primary);
    }

    .pattern-stats {
      display: flex;
      gap: 16px;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .pattern-description {
      color: var(--text-secondary);
      margin: 0 0 12px 0;
      line-height: 1.6;
    }

    .pattern-code {
      display: block;
      padding: 12px;
      background: var(--bg-primary);
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      color: #3b82f6;
      margin-bottom: 12px;
      overflow-x: auto;
    }

    .created-date, .completed-date {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .challenge-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .challenge-info h3 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--text-primary);
    }

    .difficulty-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .difficulty-badge.easy {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .difficulty-badge.medium {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    .difficulty-badge.hard {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .challenge-points {
      font-size: 1.3rem;
      font-weight: 700;
      color: #f59e0b;
      margin-bottom: 8px;
    }

    .member-since {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary);
      font-style: italic;
    }

    .loading-state, .error-state {
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

    @media (max-width: 768px) {
      .profile-header {
        padding: 24px;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .header-actions {
        margin-left: 0;
        width: 100%;
      }

      .share-btn {
        width: 100%;
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .pattern-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = true;
  error = '';
  username = '';

  constructor(
    private route: ActivatedRoute,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.loadProfile();
    });
  }

  loadProfile() {
    this.loading = true;
    this.leaderboardService.getUserProfile(this.username).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load user profile';
        this.loading = false;
      }
    });
  }

  shareProfile() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${this.profile?.fullName}'s Profile`,
        text: `Check out ${this.profile?.fullName}'s regex profile!`,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Profile link copied to clipboard!');
    }
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
