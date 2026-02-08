import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegexOfTheDayService, RegexOfTheDay } from '../../services/regex-of-the-day.service';

@Component({
  selector: 'app-regex-of-the-day-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="rotd-widget" *ngIf="todaysPattern">
      <div class="widget-header">
        <span class="widget-icon">🔍</span>
        <span class="widget-title">Regex of the Day</span>
        <span class="widget-badge" [ngClass]="getDifficultyClass(todaysPattern.difficulty)">
          {{ todaysPattern.difficulty }}
        </span>
      </div>

      <div class="widget-content">
        <h3 class="widget-pattern-title">{{ todaysPattern.title }}</h3>
        <p class="widget-description">{{ todaysPattern.description }}</p>

        <div class="widget-pattern">
          <code>/{{ truncatePattern(todaysPattern.pattern) }}/{{ todaysPattern.flags || '' }}</code>
        </div>

        <div class="widget-actions">
          <a [routerLink]="['/regex-of-the-day']" class="btn-view">
            View Full Pattern →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rotd-widget {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .widget-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: white;

      .widget-icon {
        font-size: 1.5rem;
      }

      .widget-title {
        flex: 1;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .widget-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;

        &.difficulty-beginner {
          background: rgba(255, 255, 255, 0.9);
          color: #388e3c;
        }

        &.difficulty-intermediate {
          background: rgba(255, 255, 255, 0.9);
          color: #f57c00;
        }

        &.difficulty-advanced {
          background: rgba(255, 255, 255, 0.9);
          color: #d32f2f;
        }
      }
    }

    .widget-content {
      background: white;
      border-radius: 8px;
      padding: 1.25rem;

      .widget-pattern-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }

      .widget-description {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .widget-pattern {
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

      .widget-actions {
        text-align: center;

        .btn-view {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
        }
      }
    }
  `]
})
export class RegexOfTheDayWidgetComponent implements OnInit {
  todaysPattern: RegexOfTheDay | null = null;

  constructor(private rotdService: RegexOfTheDayService) {}

  ngOnInit() {
    this.loadTodaysPattern();
  }

  loadTodaysPattern() {
    this.rotdService.getTodaysPattern().subscribe({
      next: (pattern) => {
        this.todaysPattern = pattern;
      },
      error: (error) => {
        console.error('Error loading today\'s pattern:', error);
        // Silently fail - widget won't show if no pattern available
      }
    });
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty.toLowerCase()}`;
  }

  truncatePattern(pattern: string): string {
    return pattern.length > 50 ? pattern.substring(0, 50) + '...' : pattern;
  }
}
