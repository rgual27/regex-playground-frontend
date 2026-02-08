import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShareResponse {
  shareCode: string;
  shareUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateShareCode(patternId: number): Observable<ShareResponse> {
    return this.http.post<ShareResponse>(`${this.apiUrl}/share/pattern/${patternId}`, {});
  }

  togglePublic(patternId: number): Observable<{isPublic: boolean}> {
    return this.http.post<{isPublic: boolean}>(`${this.apiUrl}/share/pattern/${patternId}/public`, {});
  }
}
