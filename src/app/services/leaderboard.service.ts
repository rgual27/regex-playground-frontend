import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Badge {
  id: number;
  badgeType: string;
  displayName: string;
  description: string;
  emoji: string;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  userId: number;
  username: string;
  fullName: string;
  totalPoints: number;
  challengesCompleted: number;
  patternsShared: number;
  currentStreak: number;
  badges: Badge[];
  joinedAt: string;
  rank: number;
}

export interface UserProfile {
  userId: number;
  username: string;
  fullName: string;
  joinedAt: string;
  totalPoints: number;
  challengesCompleted: number;
  patternsShared: number;
  patternsSaved: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  badges: Badge[];
  recentPatterns: any[];
  recentChallenges: any[];
}

export interface LeaderboardPage {
  content: LeaderboardEntry[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getLeaderboard(period: string = 'alltime', page: number = 0, size: number = 50): Observable<LeaderboardPage> {
    return this.http.get<LeaderboardPage>(`${this.apiUrl}/leaderboard`, {
      params: { period, page: page.toString(), size: size.toString() }
    });
  }

  getUserProfile(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/leaderboard/users/${username}/profile`);
  }

  awardPoints(action: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/leaderboard/award-points`, null, {
      params: { action }
    });
  }
}
