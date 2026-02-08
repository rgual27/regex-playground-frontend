import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  task: string;
  testCases: { input: string; shouldMatch: boolean }[];
  hints: string[];
  solution: string;
  points: number;
  category: string;
}

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="challenges-container">
      <div class="challenges-header">
        <h1>🏆 {{ 'challenges.title' | translate }}</h1>
        <p class="subtitle">{{ 'challenges.subtitle' | translate }}</p>
        <div class="stats">
          <div class="stat-card">
            <span class="stat-value">{{ solvedCount }}</span>
            <span class="stat-label">{{ 'challenges.solved' | translate }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ totalPoints }}</span>
            <span class="stat-label">{{ 'challenges.points' | translate }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ streak }}</span>
            <span class="stat-label">{{ 'challenges.streak' | translate }}</span>
          </div>
        </div>
      </div>

      <div class="daily-challenge" *ngIf="todayChallenge">
        <div class="challenge-badge">⭐ {{ 'challenges.challengeOfDay' | translate }}</div>
        <h2>{{ todayChallenge.title }}</h2>
        <p class="challenge-desc">{{ todayChallenge.description }}</p>
        <div class="challenge-meta">
          <span class="difficulty-badge" [class]="todayChallenge.difficulty">
            {{ 'challenges.difficulty.' + todayChallenge.difficulty.toLowerCase() | translate }}
          </span>
          <span class="points-badge">{{ todayChallenge.points }} {{ 'challenges.points' | translate | lowercase }}</span>
          <span class="category-badge">{{ todayChallenge.category }}</span>
        </div>
        <button class="try-challenge-btn" (click)="tryChallenge(todayChallenge)">
          🚀 {{ 'challenges.tryChallenge' | translate }}
        </button>
      </div>

      <div class="filter-section">
        <button
          *ngFor="let diff of difficulties"
          class="filter-btn"
          [class.active]="selectedDifficulty === diff"
          (click)="selectedDifficulty = diff; filterChallenges()">
          {{ getDifficultyTranslation(diff) | translate }}
        </button>
      </div>

      <div class="challenges-grid">
        <div
          *ngFor="let challenge of filteredChallenges"
          class="challenge-card"
          [class]="challenge.difficulty"
          [class.solved]="isSolved(challenge.id)">

          <div class="challenge-header">
            <h3>{{ challenge.title }}</h3>
            <span class="solved-badge" *ngIf="isSolved(challenge.id)">✓ {{ 'challenges.solvedBadge' | translate }}</span>
          </div>

          <p class="challenge-description">{{ challenge.description }}</p>

          <div class="challenge-footer">
            <div class="challenge-meta">
              <span class="difficulty-badge" [class]="challenge.difficulty">
                {{ 'challenges.difficulty.' + challenge.difficulty | translate }}
              </span>
              <span class="points-badge">{{ challenge.points }}pts</span>
            </div>
            <button
              class="solve-btn"
              (click)="tryChallenge(challenge)"
              [disabled]="isSolved(challenge.id)">
              {{ isSolved(challenge.id) ? ('✓ ' + ('challenges.solvedBadge' | translate)) : ('challenges.solve' | translate) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Challenge Modal -->
      <div class="modal-overlay" *ngIf="activeChallenge" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ activeChallenge.title }}</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>

          <div class="modal-body">
            <div class="task-section">
              <h3>📝 Task</h3>
              <p>{{ activeChallenge.task }}</p>
            </div>

            <div class="test-cases-section">
              <h3>🧪 Test Cases</h3>
              <div class="test-case" *ngFor="let testCase of activeChallenge.testCases; let i = index">
                <code>{{ testCase.input }}</code>
                <span [class]="testCase.shouldMatch ? 'should-match' : 'should-not-match'">
                  {{ testCase.shouldMatch ? '✓ Should match' : '✗ Should NOT match' }}
                </span>
                <span class="result-badge" *ngIf="testResults[i] !== undefined"
                      [class.pass]="testResults[i]"
                      [class.fail]="!testResults[i]">
                  {{ testResults[i] ? '✓ PASS' : '✗ FAIL' }}
                </span>
              </div>
            </div>

            <div class="solution-section">
              <h3>💡 Your Solution</h3>
              <input
                type="text"
                [(ngModel)]="userPattern"
                placeholder="Enter your regex pattern..."
                class="pattern-input"
                (keyup.enter)="testSolution()">
              <div class="solution-actions">
                <button class="test-btn" (click)="testSolution()">🧪 Test Solution</button>
                <button class="hint-btn" (click)="showHint()" *ngIf="!hintShown">💡 Show Hint</button>
                <button class="solution-btn" (click)="showSolution()" *ngIf="!solutionShown">
                  👁️ Show Solution
                </button>
              </div>

              <div class="hint-box" *ngIf="hintShown">
                <strong>💡 Hint:</strong> {{ activeChallenge.hints[currentHint] }}
              </div>

              <div class="solution-box" *ngIf="solutionShown">
                <strong>✅ Solution:</strong>
                <code>{{ activeChallenge.solution }}</code>
              </div>

              <div class="success-box" *ngIf="challengeSolved">
                <h3>🎉 Challenge Completed!</h3>
                <p>You earned {{ activeChallenge.points }} points!</p>
                <button class="next-btn" (click)="nextChallenge()">Next Challenge →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .challenges-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .challenges-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .challenges-header h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .stats {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 40px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
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

    .daily-challenge {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
      border: 2px solid #f59e0b;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 40px;
      text-align: center;
    }

    .challenge-badge {
      display: inline-block;
      padding: 8px 20px;
      background: #f59e0b;
      color: white;
      border-radius: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }

    .daily-challenge h2 {
      font-size: 2rem;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .challenge-desc {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .challenge-meta {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .difficulty-badge {
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 0.85rem;
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

    .points-badge, .category-badge {
      padding: 6px 16px;
      background: var(--bg-secondary);
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid var(--border-color);
    }

    .try-challenge-btn {
      padding: 16px 32px;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .try-challenge-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
    }

    .filter-section {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 10px 24px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 25px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      text-transform: capitalize;
    }

    .filter-btn:hover {
      border-color: #f59e0b;
      transform: translateY(-2px);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      color: white;
      border-color: #f59e0b;
    }

    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .challenge-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .challenge-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #10b981;
      border-radius: 12px 0 0 12px;
    }

    .challenge-card.medium::before {
      background: #f59e0b;
    }

    .challenge-card.hard::before {
      background: #ef4444;
    }

    .challenge-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: #f59e0b;
    }

    .challenge-card.solved {
      opacity: 0.7;
      border-color: #10b981;
    }

    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .challenge-header h3 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin: 0;
    }

    .solved-badge {
      padding: 4px 12px;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .challenge-description {
      color: var(--text-secondary);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .challenge-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .solve-btn {
      padding: 8px 20px;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .solve-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }

    .solve-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: 16px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 2px solid var(--border-color);
    }

    .modal-header h2 {
      margin: 0;
      color: var(--text-primary);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: var(--text-secondary);
      cursor: pointer;
      line-height: 1;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      color: var(--text-primary);
      transform: scale(1.1);
    }

    .modal-body {
      padding: 24px;
    }

    .task-section, .test-cases-section, .solution-section {
      margin-bottom: 32px;
    }

    .task-section h3, .test-cases-section h3, .solution-section h3 {
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .test-case {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--bg-secondary);
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid var(--border-color);
    }

    .test-case code {
      flex: 1;
      font-family: 'Courier New', monospace;
      color: var(--text-primary);
      background: var(--bg-primary);
      padding: 6px 12px;
      border-radius: 4px;
    }

    .should-match {
      color: #10b981;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .should-not-match {
      color: #ef4444;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .result-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .result-badge.pass {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .result-badge.fail {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .pattern-input {
      width: 100%;
      padding: 16px;
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .pattern-input:focus {
      outline: none;
      border-color: #f59e0b;
    }

    .solution-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .test-btn, .hint-btn, .solution-btn, .next-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .test-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .hint-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .solution-btn {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
    }

    .test-btn:hover, .hint-btn:hover, .solution-btn:hover, .next-btn:hover {
      transform: scale(1.05);
    }

    .hint-box, .solution-box {
      padding: 16px;
      background: rgba(245, 158, 11, 0.1);
      border-left: 4px solid #f59e0b;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .solution-box code {
      display: block;
      margin-top: 8px;
      padding: 12px;
      background: var(--bg-primary);
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #3b82f6;
    }

    .success-box {
      padding: 24px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
      border: 2px solid #10b981;
      border-radius: 12px;
      text-align: center;
    }

    .success-box h3 {
      color: #10b981;
      margin-bottom: 12px;
    }

    .next-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .challenges-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        max-height: 95vh;
      }

      .solution-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ChallengesComponent implements OnInit {
  difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  selectedDifficulty = 'All';
  filteredChallenges: Challenge[] = [];
  activeChallenge: Challenge | null = null;
  todayChallenge: Challenge | null = null;
  userPattern = '';
  testResults: boolean[] = [];
  hintShown = false;
  solutionShown = false;
  challengeSolved = false;
  currentHint = 0;
  solvedCount = 0;
  totalPoints = 0;
  streak = 0;

  challenges: Challenge[] = [
    {
      id: 1,
      title: 'Email Extractor',
      description: 'Extract all email addresses from text',
      difficulty: 'easy',
      task: 'Write a regex that matches valid email addresses',
      testCases: [
        { input: 'user@example.com', shouldMatch: true },
        { input: 'test.email+tag@domain.co.uk', shouldMatch: true },
        { input: 'invalid@', shouldMatch: false },
        { input: '@invalid.com', shouldMatch: false }
      ],
      hints: [
        'Start with matching the username part before @',
        'Remember emails can have dots and special characters',
        'The domain must have a TLD like .com, .org'
      ],
      solution: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      points: 10,
      category: 'Validation'
    },
    {
      id: 2,
      title: 'Phone Number Validator',
      description: 'Match US phone numbers in various formats',
      difficulty: 'easy',
      task: 'Create a regex that matches phone numbers like (555) 123-4567 or 555-123-4567',
      testCases: [
        { input: '(555) 123-4567', shouldMatch: true },
        { input: '555-123-4567', shouldMatch: true },
        { input: '5551234567', shouldMatch: true },
        { input: '123-45', shouldMatch: false }
      ],
      hints: [
        'Phone numbers have 10 digits',
        'Parentheses and dashes are optional',
        'Use optional groups with ?'
      ],
      solution: '\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}',
      points: 10,
      category: 'Validation'
    },
    {
      id: 3,
      title: 'URL Protocol Matcher',
      description: 'Match URLs starting with http or https',
      difficulty: 'easy',
      task: 'Write a regex that matches both http:// and https:// at the start of URLs',
      testCases: [
        { input: 'https://example.com', shouldMatch: true },
        { input: 'http://test.org', shouldMatch: true },
        { input: 'ftp://files.com', shouldMatch: false },
        { input: 'example.com', shouldMatch: false }
      ],
      hints: [
        'Use ^ to match start of string',
        'The "s" in https is optional',
        'Use ? to make a character optional'
      ],
      solution: '^https?://',
      points: 10,
      category: 'Extraction'
    },
    {
      id: 4,
      title: 'Password Strength',
      description: 'Validate strong passwords',
      difficulty: 'medium',
      task: 'Match passwords with at least 8 characters, one uppercase, one lowercase, and one digit',
      testCases: [
        { input: 'Password123', shouldMatch: true },
        { input: 'StrongP4ss', shouldMatch: true },
        { input: 'weak', shouldMatch: false },
        { input: 'NoDigits', shouldMatch: false }
      ],
      hints: [
        'Use positive lookaheads (?=...)',
        'Check for lowercase (?=.*[a-z])',
        'Check minimum length with {8,}'
      ],
      solution: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
      points: 20,
      category: 'Validation'
    },
    {
      id: 5,
      title: 'Hex Color Code',
      description: 'Match hexadecimal color codes',
      difficulty: 'medium',
      task: 'Match both 3-digit and 6-digit hex color codes like #FFF or #FFFFFF',
      testCases: [
        { input: '#FFF', shouldMatch: true },
        { input: '#FFFFFF', shouldMatch: true },
        { input: '#3b82f6', shouldMatch: true },
        { input: '#GGG', shouldMatch: false }
      ],
      hints: [
        'Hex colors start with #',
        'Valid characters are 0-9, A-F, a-f',
        'Use {3} or {6} for exact length'
      ],
      solution: '#[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?',
      points: 20,
      category: 'Validation'
    },
    {
      id: 6,
      title: 'HTML Tag Remover',
      description: 'Remove all HTML tags from text',
      difficulty: 'medium',
      task: 'Match any HTML opening or closing tag',
      testCases: [
        { input: '<div>', shouldMatch: true },
        { input: '</span>', shouldMatch: true },
        { input: '<img src="test.jpg">', shouldMatch: true },
        { input: 'plain text', shouldMatch: false }
      ],
      hints: [
        'Tags start with < and end with >',
        'Use [^>] to match any character except >',
        'The + quantifier matches one or more'
      ],
      solution: '<[^>]+>',
      points: 20,
      category: 'Formatting'
    },
    {
      id: 7,
      title: 'IPv4 Address',
      description: 'Match valid IPv4 addresses',
      difficulty: 'hard',
      task: 'Match valid IP addresses ensuring each octet is between 0-255',
      testCases: [
        { input: '192.168.1.1', shouldMatch: true },
        { input: '255.255.255.0', shouldMatch: true },
        { input: '256.1.1.1', shouldMatch: false },
        { input: '192.168.1', shouldMatch: false }
      ],
      hints: [
        'Each octet can be 0-255',
        '25[0-5] matches 250-255',
        '2[0-4][0-9] matches 200-249'
      ],
      solution: '\\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      points: 30,
      category: 'Validation'
    },
    {
      id: 8,
      title: 'Balanced Parentheses',
      description: 'Match strings with balanced parentheses',
      difficulty: 'hard',
      task: 'Match strings where every opening parenthesis has a matching closing one',
      testCases: [
        { input: '()', shouldMatch: true },
        { input: '(())', shouldMatch: true },
        { input: '(()', shouldMatch: false },
        { input: '())', shouldMatch: false }
      ],
      hints: [
        'This is a classic recursion problem',
        'Regex alone cannot fully solve this',
        'Use \\( and \\) to match literal parentheses'
      ],
      solution: '\\((?:[^()]|\\((?:[^()]|\\([^()]*\\))*\\))*\\)',
      points: 30,
      category: 'Advanced'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProgress();
    this.setTodayChallenge();
    this.filterChallenges();
  }

  loadProgress() {
    const saved = localStorage.getItem('regexChallengesProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      this.solvedCount = progress.solvedCount || 0;
      this.totalPoints = progress.totalPoints || 0;
      this.streak = progress.streak || 0;
    }
  }

  saveProgress() {
    localStorage.setItem('regexChallengesProgress', JSON.stringify({
      solvedCount: this.solvedCount,
      totalPoints: this.totalPoints,
      streak: this.streak
    }));
  }

  setTodayChallenge() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    this.todayChallenge = this.challenges[dayOfYear % this.challenges.length];
  }

  filterChallenges() {
    if (this.selectedDifficulty === 'All') {
      this.filteredChallenges = this.challenges;
    } else {
      this.filteredChallenges = this.challenges.filter(
        c => c.difficulty.toLowerCase() === this.selectedDifficulty.toLowerCase()
      );
    }
  }

  tryChallenge(challenge: Challenge) {
    this.activeChallenge = challenge;
    this.userPattern = '';
    this.testResults = [];
    this.hintShown = false;
    this.solutionShown = false;
    this.challengeSolved = false;
    this.currentHint = 0;
  }

  closeModal() {
    this.activeChallenge = null;
  }

  testSolution() {
    if (!this.activeChallenge || !this.userPattern) return;

    try {
      const regex = new RegExp(this.userPattern, 'g');
      this.testResults = this.activeChallenge.testCases.map(testCase => {
        const matches = regex.test(testCase.input);
        return matches === testCase.shouldMatch;
      });

      const allPassed = this.testResults.every(result => result);
      if (allPassed) {
        this.challengeSolved = true;
        if (!this.isSolved(this.activeChallenge.id)) {
          this.solvedCount++;
          this.totalPoints += this.activeChallenge.points;
          this.markSolved(this.activeChallenge.id);
          this.saveProgress();
        }
      }
    } catch (error) {
      console.error('Invalid regex:', error);
    }
  }

  showHint() {
    this.hintShown = true;
    if (this.currentHint < this.activeChallenge!.hints.length - 1) {
      this.currentHint++;
    }
  }

  showSolution() {
    this.solutionShown = true;
    this.userPattern = this.activeChallenge!.solution;
  }

  nextChallenge() {
    const currentIndex = this.challenges.findIndex(c => c.id === this.activeChallenge!.id);
    const nextIndex = (currentIndex + 1) % this.challenges.length;
    this.tryChallenge(this.challenges[nextIndex]);
  }

  isSolved(challengeId: number): boolean {
    const solved = localStorage.getItem('solvedChallenges');
    if (!solved) return false;
    const solvedIds = JSON.parse(solved);
    return solvedIds.includes(challengeId);
  }

  markSolved(challengeId: number) {
    const solved = localStorage.getItem('solvedChallenges');
    const solvedIds = solved ? JSON.parse(solved) : [];
    if (!solvedIds.includes(challengeId)) {
      solvedIds.push(challengeId);
      localStorage.setItem('solvedChallenges', JSON.stringify(solvedIds));
    }
  }

  getDifficultyTranslation(difficulty: string): string {
    const diffMap: { [key: string]: string } = {
      'All': 'challenges.difficulty.all',
      'Easy': 'challenges.difficulty.easy',
      'Medium': 'challenges.difficulty.medium',
      'Hard': 'challenges.difficulty.hard'
    };
    return diffMap[difficulty] || difficulty;
  }
}
