import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CommunityPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
  flags: string;
  flavor: string;
  category: string;
  authorName: string;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  shareCode: string;
}

export interface PaginatedPatterns {
  patterns: CommunityPattern[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Comment {
  id: number;
  comment: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComments {
  comments: Comment[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface RatingResponse {
  message: string;
  averageRating: number;
  ratingCount: number;
}

export interface UserRating {
  hasRated: boolean;
  rating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = `${environment.apiUrl}/api/community`;

  constructor(private http: HttpClient) { }

  getPublicPatterns(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'recent',
    category?: string,
    search?: string
  ): Observable<PaginatedPatterns> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    if (category) {
      params = params.set('category', category);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedPatterns>(`${this.apiUrl}/patterns`, { params });
  }

  ratePattern(patternId: number, rating: number): Observable<RatingResponse> {
    return this.http.post<RatingResponse>(
      `${this.apiUrl}/patterns/${patternId}/rate`,
      { rating }
    );
  }

  getPatternRatings(patternId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patterns/${patternId}/ratings`);
  }

  getUserRating(patternId: number): Observable<UserRating> {
    return this.http.get<UserRating>(`${this.apiUrl}/patterns/${patternId}/user-rating`);
  }

  addComment(patternId: number, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/patterns/${patternId}/comments`, { comment });
  }

  getComments(patternId: number, page: number = 0, size: number = 10): Observable<PaginatedComments> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedComments>(`${this.apiUrl}/patterns/${patternId}/comments`, { params });
  }

  forkPattern(patternId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/patterns/${patternId}/fork`, {});
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
