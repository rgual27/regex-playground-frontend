import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiKey {
  id?: number;
  name: string;
  dailyLimit: number;
  usageToday: number;
  lastUsedAt?: Date;
  createdAt?: Date;
}

export interface ApiKeyResponse {
  apiKey: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getApiKeys(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(`${this.apiUrl}/api/api-keys`);
  }

  createApiKey(name: string): Observable<ApiKeyResponse> {
    return this.http.post<ApiKeyResponse>(`${this.apiUrl}/api/api-keys`, { name });
  }

  deleteApiKey(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/api-keys/${id}`);
  }
}
