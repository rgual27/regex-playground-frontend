import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExportResponse {
  code: string;
  filename: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  exportCode(language: string, pattern: string, flags: string): Observable<ExportResponse> {
    return this.http.post<ExportResponse>(
      `${this.apiUrl}/api/export/${language}`,
      { pattern, flags }
    );
  }

  downloadCode(code: string, filename: string): void {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  copyToClipboard(code: string): Promise<void> {
    return navigator.clipboard.writeText(code);
  }
}
