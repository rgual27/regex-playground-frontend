import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Team {
  id?: number;
  name: string;
  description?: string;
  memberCount?: number;
}

export interface TeamMember {
  id?: number;
  userName: string;
  userEmail: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/api/teams`);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/api/teams/${id}`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/api/teams`, team);
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/api/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/teams/${id}`);
  }

  getTeamMembers(teamId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/api/teams/${teamId}/members`);
  }

  addMember(teamId: number, email: string, role: string): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.apiUrl}/api/teams/${teamId}/members`, { email, role });
  }

  removeMember(teamId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/teams/${teamId}/members/${memberId}`);
  }

  inviteMember(teamId: number, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/teams/${teamId}/invite`, { email });
  }

  acceptInvitation(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/teams/join/${token}`, {});
  }

  declineInvitation(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/teams/decline/${token}`, {});
  }

  getTeamInvitations(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/teams/${teamId}/invitations`);
  }

  getTeamPatterns(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/teams/${teamId}/patterns`);
  }
}
