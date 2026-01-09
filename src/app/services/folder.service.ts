import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Folder {
  id?: number;
  name: string;
  description?: string;
  color: string;
  patternCount?: number;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFolders(): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${this.apiUrl}/api/folders`);
  }

  createFolder(folder: Folder): Observable<Folder> {
    return this.http.post<Folder>(`${this.apiUrl}/api/folders`, folder);
  }

  updateFolder(id: number, folder: Folder): Observable<Folder> {
    return this.http.put<Folder>(`${this.apiUrl}/api/folders/${id}`, folder);
  }

  deleteFolder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/folders/${id}`);
  }
}
