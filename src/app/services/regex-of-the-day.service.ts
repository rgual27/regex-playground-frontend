import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegexOfTheDay {
  id: number;
  title: string;
  pattern: string;
  description: string;
  testString: string;
  explanation: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  date: string;
  likes: number;
  shares: number;
  flags?: string;
  createdAt?: string;
}

export interface RegexOfTheDayPage {
  content: RegexOfTheDay[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegexOfTheDayService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get today's regex pattern
   */
  getTodaysPattern(): Observable<RegexOfTheDay> {
    return this.http.get<RegexOfTheDay>(`${this.apiUrl}/api/regex-of-the-day`);
  }

  /**
   * Get pattern for specific date
   */
  getPatternByDate(date: string): Observable<RegexOfTheDay> {
    return this.http.get<RegexOfTheDay>(`${this.apiUrl}/api/regex-of-the-day/${date}`);
  }

  /**
   * Like a pattern
   */
  likePattern(id: number): Observable<RegexOfTheDay> {
    return this.http.post<RegexOfTheDay>(`${this.apiUrl}/api/regex-of-the-day/${id}/like`, {});
  }

  /**
   * Increment share count
   */
  sharePattern(id: number): Observable<RegexOfTheDay> {
    return this.http.post<RegexOfTheDay>(`${this.apiUrl}/api/regex-of-the-day/${id}/share`, {});
  }

  /**
   * Get paginated archive of past patterns
   */
  getArchive(page: number = 0, size: number = 20): Observable<RegexOfTheDayPage> {
    return this.http.get<RegexOfTheDayPage>(
      `${this.apiUrl}/api/regex-of-the-day/archive?page=${page}&size=${size}`
    );
  }

  /**
   * Generate share text for social media
   */
  getShareText(pattern: RegexOfTheDay): string {
    return `Check out today's Regex of the Day: ${pattern.title} 🔍 #regex #regexoftheday #coding`;
  }

  /**
   * Generate share URL
   */
  getShareUrl(pattern: RegexOfTheDay): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/regex-of-the-day?date=${pattern.date}`;
  }

  /**
   * Get Twitter share URL
   */
  getTwitterShareUrl(pattern: RegexOfTheDay): string {
    const text = this.getShareText(pattern);
    const url = this.getShareUrl(pattern);
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  }

  /**
   * Get LinkedIn share URL
   */
  getLinkedInShareUrl(pattern: RegexOfTheDay): string {
    const url = this.getShareUrl(pattern);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  }

  /**
   * Copy share URL to clipboard
   */
  async copyShareUrl(pattern: RegexOfTheDay): Promise<boolean> {
    try {
      const url = this.getShareUrl(pattern);
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.error('Failed to copy URL:', err);
      return false;
    }
  }
}
