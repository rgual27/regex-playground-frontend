import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegexPattern {
  id?: number;
  name: string;
  pattern: string;
  description?: string;
  testString?: string;
  flags?: string;
  testCases?: TestCase[];
  tags?: string[];
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestCase {
  id?: number;
  input: string;
  expectedOutput: string;
  shouldMatch: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private apiUrl = environment.apiUrl;
  private selectedPatternSubject = new BehaviorSubject<RegexPattern | null>(null);
  public selectedPattern$ = this.selectedPatternSubject.asObservable();

  constructor(private http: HttpClient) {}

  savePattern(pattern: RegexPattern): Observable<RegexPattern> {
    return this.http.post<RegexPattern>(`${this.apiUrl}/api/patterns`, pattern);
  }

  getMyPatterns(): Observable<RegexPattern[]> {
    return this.http.get<RegexPattern[]>(`${this.apiUrl}/api/patterns/my`);
  }

  getPattern(id: number): Observable<RegexPattern> {
    return this.http.get<RegexPattern>(`${this.apiUrl}/api/patterns/${id}`);
  }

  updatePattern(id: number, pattern: RegexPattern): Observable<RegexPattern> {
    return this.http.put<RegexPattern>(`${this.apiUrl}/api/patterns/${id}`, pattern);
  }

  deletePattern(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/patterns/${id}`);
  }

  getPublicPatterns(): Observable<RegexPattern[]> {
    return this.http.get<RegexPattern[]>(`${this.apiUrl}/api/patterns/public`);
  }

  loadPatternIntoTester(pattern: RegexPattern): void {
    this.selectedPatternSubject.next(pattern);
  }

  clearSelectedPattern(): void {
    this.selectedPatternSubject.next(null);
  }
}
