import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { RegexOfTheDayService, RegexOfTheDay } from '../../services/regex-of-the-day.service';
import { NotificationService } from '../../services/notification.service';
import { PatternService } from '../../services/pattern.service';

@Component({
  selector: 'app-regex-of-the-day',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './regex-of-the-day.component.html',
  styleUrls: ['./regex-of-the-day.component.scss']
})
export class RegexOfTheDayComponent implements OnInit {
  todaysPattern: RegexOfTheDay | null = null;
  loading: boolean = true;
  hasLiked: boolean = false;

  constructor(
    private rotdService: RegexOfTheDayService,
    private notificationService: NotificationService,
    private patternService: PatternService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for date parameter
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.loadPatternByDate(params['date']);
      } else {
        this.loadTodaysPattern();
      }
    });

    // Check if user has already liked today
    const likedDate = localStorage.getItem('rotd_liked_date');
    const today = new Date().toISOString().split('T')[0];
    this.hasLiked = likedDate === today;
  }

  loadTodaysPattern() {
    this.loading = true;
    this.rotdService.getTodaysPattern().subscribe({
      next: (pattern) => {
        this.todaysPattern = pattern;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading today\'s pattern:', error);
        this.notificationService.error('Failed to load today\'s regex pattern');
        this.loading = false;
      }
    });
  }

  loadPatternByDate(date: string) {
    this.loading = true;
    this.rotdService.getPatternByDate(date).subscribe({
      next: (pattern) => {
        this.todaysPattern = pattern;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pattern:', error);
        this.notificationService.error('Failed to load regex pattern for this date');
        this.loading = false;
        // Fall back to today's pattern
        this.loadTodaysPattern();
      }
    });
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

  likePattern() {
    if (!this.todaysPattern || this.hasLiked) {
      return;
    }

    this.rotdService.likePattern(this.todaysPattern.id).subscribe({
      next: (updatedPattern) => {
        this.todaysPattern = updatedPattern;
        this.hasLiked = true;
        // Store in localStorage to prevent multiple likes
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('rotd_liked_date', today);
        this.notificationService.success('Thanks for liking today\'s pattern!');
      },
      error: (error) => {
        console.error('Error liking pattern:', error);
        this.notificationService.error('Failed to like pattern');
      }
    });
  }

  tryInTester() {
    if (!this.todaysPattern) {
      return;
    }

    // Navigate to home page with pattern loaded
    this.router.navigate(['/'], {
      queryParams: {
        pattern: this.todaysPattern.pattern,
        test: this.todaysPattern.testString,
        flags: this.todaysPattern.flags || ''
      }
    });
  }

  shareOnTwitter() {
    if (!this.todaysPattern) {
      return;
    }

    // Track share
    this.rotdService.sharePattern(this.todaysPattern.id).subscribe();

    // Open Twitter share dialog
    const url = this.rotdService.getTwitterShareUrl(this.todaysPattern);
    window.open(url, '_blank', 'width=550,height=420');
  }

  shareOnLinkedIn() {
    if (!this.todaysPattern) {
      return;
    }

    // Track share
    this.rotdService.sharePattern(this.todaysPattern.id).subscribe();

    // Open LinkedIn share dialog
    const url = this.rotdService.getLinkedInShareUrl(this.todaysPattern);
    window.open(url, '_blank', 'width=550,height=420');
  }

  async copyLink() {
    if (!this.todaysPattern) {
      return;
    }

    // Track share
    this.rotdService.sharePattern(this.todaysPattern.id).subscribe();

    // Copy to clipboard
    const success = await this.rotdService.copyShareUrl(this.todaysPattern);
    if (success) {
      this.notificationService.success('Link copied to clipboard!');
    } else {
      this.notificationService.error('Failed to copy link');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
