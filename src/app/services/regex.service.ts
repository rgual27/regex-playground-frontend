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

@Injectable({
  providedIn: 'root'
})
export class RegexService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  testRegex(request: RegexTestRequest): Observable<RegexTestResponse> {
    return this.http.post<RegexTestResponse>(`${this.apiUrl}/api/regex/test`, request);
  }
}
