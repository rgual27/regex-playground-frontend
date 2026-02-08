import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegexTestRequest {
  pattern: string;
  testString: string;
  flags?: string;
}

export interface RegexMatch {
  fullMatch: string;
  start: number;
  end: number;
  groups: string[];
}

export interface RegexTestResponse {
  pattern: string;
  testString: string;
  flags?: string;
  isValid: boolean;
  matchCount?: number;
  matches?: RegexMatch[];
  explanation?: string;
  error?: string;
  errorIndex?: number;
}

export interface EmbedStats {
  totalViews: number;
  totalInteractions: number;
  viewsByDate: { [date: string]: number };
  interactionsByDate: { [date: string]: number };
  topReferrers: { [referrer: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class RegexService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  testRegex(request: RegexTestRequest): Observable<RegexTestResponse> {
    return this.http.post<RegexTestResponse>(`${this.apiUrl}/api/regex/test`, request);
  }

  // Track embed widget events (views and interactions)
  trackEmbedEvent(eventType: 'view' | 'interaction'): Observable<void> {
    const referrer = document.referrer || 'direct';
    return this.http.post<void>(`${this.apiUrl}/api/embed/track`, {
      eventType,
      referrer,
      timestamp: new Date().toISOString()
    });
  }

  // Get embed analytics stats (admin only)
  getEmbedStats(): Observable<EmbedStats> {
    return this.http.get<EmbedStats>(`${this.apiUrl}/api/embed/stats`);
  }
}
