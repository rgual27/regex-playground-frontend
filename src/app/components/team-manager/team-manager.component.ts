import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService, Team, TeamMember } from '../../services/team.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="team-manager">
      <div class="header">
        <h2>{{ 'teams.title' | translate }}</h2>
        <button class="btn btn-primary" (click)="showCreateTeamModal = true">
          <span class="icon">+</span> {{ 'teams.create' | translate }}
        </button>
      </div>

      <div class="teams-list" *ngIf="teams.length > 0">
        <div *ngFor="let team of teams" class="team-card">
          <div class="team-header">
            <div>
              <h3>{{ team.name }}</h3>
              <p class="team-description" *ngIf="team.description">{{ team.description }}</p>
            </div>
            <div class="team-actions">
              <button class="btn btn-sm btn-secondary" (click)="viewTeam(team)">
                {{ 'teams.viewMembers' | translate }}
              </button>
              <button class="btn-icon" (click)="editTeam(team)">✏️</button>
              <button class="btn-icon" (click)="confirmDeleteTeam(team)">🗑️</button>
            </div>
          </div>
          <div class="team-stats">
            <span class="stat">
              <span class="stat-icon">👥</span>
              {{ team.memberCount || 0 }} {{ 'teams.members' | translate }}
            </span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="teams.length === 0 && !loading">
        <div class="empty-icon">👥</div>
        <h3>{{ 'teams.empty.title' | translate }}</h3>
        <p>{{ 'teams.empty.description' | translate }}</p>
        <button class="btn btn-primary" (click)="showCreateTeamModal = true">
          {{ 'teams.create' | translate }}
        </button>
      </div>

      <!-- Create/Edit Team Modal -->
      <div class="modal-overlay" *ngIf="showCreateTeamModal || editingTeam" (click)="closeTeamModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingTeam ? ('teams.edit' | translate) : ('teams.create' | translate) }}</h3>
            <button class="close-btn" (click)="closeTeamModal()">×</button>
          </div>
          <form (ngSubmit)="saveTeam()">
            <div class="form-group">
              <label>{{ 'teams.name' | translate }}</label>
              <input
                type="text"
                [(ngModel)]="teamForm.name"
                name="name"
                class="form-control"
                placeholder="Development Team"
                required>
            </div>
            <div class="form-group">
              <label>{{ 'teams.description' | translate }}</label>
              <textarea
                [(ngModel)]="teamForm.description"
                name="description"
                class="form-control"
                placeholder="Optional team description"
                rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeTeamModal()">
                {{ 'common.cancel' | translate }}
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="saving || !teamForm.name">
                {{ saving ? ('common.saving' | translate) : ('common.save' | translate) }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Team Members Modal -->
      <div class="modal-overlay" *ngIf="selectedTeam" (click)="selectedTeam = null">
        <div class="modal modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ selectedTeam.name }} - {{ 'teams.members' | translate }}</h3>
            <button class="close-btn" (click)="selectedTeam = null">×</button>
          </div>

          <div class="add-member-section">
            <input
              type="email"
              [(ngModel)]="newMemberEmail"
              class="form-control"
              placeholder="{{ 'teams.memberEmail' | translate }}"
              [disabled]="addingMember">
            <select [(ngModel)]="newMemberRole" class="form-control" [disabled]="addingMember">
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              class="btn btn-primary"
              (click)="addMember()"
              [disabled]="addingMember || !newMemberEmail">
              {{ addingMember ? ('common.adding' | translate) : ('teams.addMember' | translate) }}
            </button>
          </div>

          <div class="members-list" *ngIf="members.length > 0">
            <div *ngFor="let member of members" class="member-item">
              <div class="member-info">
                <div class="member-avatar">{{ member.userName.charAt(0).toUpperCase() }}</div>
                <div class="member-details">
                  <div class="member-name">{{ member.userName }}</div>
                  <div class="member-email">{{ member.userEmail }}</div>
                </div>
              </div>
              <div class="member-actions">
                <span class="role-badge" [class.role-owner]="member.role === 'OWNER'" [class.role-admin]="member.role === 'ADMIN'">
                  {{ member.role }}
                </span>
                <button
                  class="btn-icon"
                  (click)="removeMember(member)"
                  *ngIf="member.role !== 'OWNER'"
                  [disabled]="removingMember">
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state-sm" *ngIf="members.length === 0 && !loadingMembers">
            <p>{{ 'teams.noMembers' | translate }}</p>
          </div>
        </div>
      </div>

      <!-- Delete Team Confirmation Modal -->
      <div class="modal-overlay" *ngIf="deletingTeam" (click)="deletingTeam = null">
        <div class="modal modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ 'teams.deleteConfirm' | translate }}</h3>
            <button class="close-btn" (click)="deletingTeam = null">×</button>
          </div>
          <p>Are you sure you want to delete this team? This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="deletingTeam = null">
              {{ 'common.cancel' | translate }}
            </button>
            <button class="btn btn-danger" (click)="deleteTeam()" [disabled]="saving">
              {{ saving ? ('common.deleting' | translate) : ('common.delete' | translate) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .team-manager {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        margin: 0;
      }
    }

    .teams-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .team-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;

      &:hover {
        box-shadow: var(--shadow-lg);
      }
    }

    .team-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }

      .team-description {
        color: var(--text-secondary);
        margin: 0;
      }

      .team-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
    }

    .team-stats {
      display: flex;
      gap: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);

      .stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);

        .stat-icon {
          font-size: 1.125rem;
        }
      }
    }

    .btn-icon {
      background: transparent;
      border: 1px solid var(--border-color);
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-secondary);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;

      &.modal-sm {
        max-width: 400px;
      }

      &.modal-lg {
        max-width: 700px;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: var(--text-primary);
        }
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      textarea.form-control {
        resize: vertical;
        font-family: inherit;
      }
    }

    .add-member-section {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);

      .form-control {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-secondary);
        color: var(--text-primary);

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      select.form-control {
        min-width: 120px;
      }
    }

    .members-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .member-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .member-details {
      .member-name {
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .member-email {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }

    .member-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      text-transform: uppercase;

      &.role-owner {
        background: #fbbf24;
        color: #78350f;
      }

      &.role-admin {
        background: #60a5fa;
        color: #1e3a8a;
      }
    }

    .empty-state-sm {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-danger {
      background: #ef4444;
      color: white;

      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .team-manager {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .team-header {
        flex-direction: column;
        gap: 1rem;

        .team-actions {
          justify-content: flex-start;
        }
      }

      .add-member-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamManagerComponent implements OnInit {
  teams: Team[] = [];
  members: TeamMember[] = [];
  loading = false;
  loadingMembers = false;
  saving = false;
  addingMember = false;
  removingMember = false;
  showCreateTeamModal = false;
  editingTeam: Team | null = null;
  deletingTeam: Team | null = null;
  selectedTeam: Team | null = null;
  newMemberEmail = '';
  newMemberRole: 'MEMBER' | 'ADMIN' = 'MEMBER';

  teamForm: Team = {
    name: '',
    description: ''
  };

  constructor(
    private teamService: TeamService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.loading = true;
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.notificationService.error('Failed to load teams');
        this.loading = false;
      }
    });
  }

  viewTeam(team: Team) {
    this.selectedTeam = team;
    this.loadMembers(team.id!);
  }

  loadMembers(teamId: number) {
    this.loadingMembers = true;
    this.teamService.getTeamMembers(teamId).subscribe({
      next: (members) => {
        this.members = members;
        this.loadingMembers = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.notificationService.error('Failed to load team members');
        this.loadingMembers = false;
      }
    });
  }

  editTeam(team: Team) {
    this.editingTeam = team;
    this.teamForm = { ...team };
  }

  confirmDeleteTeam(team: Team) {
    this.deletingTeam = team;
  }

  closeTeamModal() {
    this.showCreateTeamModal = false;
    this.editingTeam = null;
    this.teamForm = {
      name: '',
      description: ''
    };
  }

  saveTeam() {
    if (!this.teamForm.name.trim()) {
      this.notificationService.warning('Please enter a team name');
      return;
    }

    this.saving = true;
    const operation = this.editingTeam
      ? this.teamService.updateTeam(this.editingTeam.id!, this.teamForm)
      : this.teamService.createTeam(this.teamForm);

    operation.subscribe({
      next: () => {
        this.notificationService.success(
          this.editingTeam ? 'Team updated successfully' : 'Team created successfully'
        );
        this.closeTeamModal();
        this.loadTeams();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving team:', error);
        this.notificationService.error(error.error?.message || 'Failed to save team');
        this.saving = false;
      }
    });
  }

  deleteTeam() {
    if (!this.deletingTeam?.id) return;

    this.saving = true;
    this.teamService.deleteTeam(this.deletingTeam.id).subscribe({
      next: () => {
        this.notificationService.success('Team deleted successfully');
        this.deletingTeam = null;
        this.loadTeams();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error deleting team:', error);
        this.notificationService.error(error.error?.message || 'Failed to delete team');
        this.saving = false;
      }
    });
  }

  addMember() {
    if (!this.selectedTeam?.id || !this.newMemberEmail.trim()) return;

    this.addingMember = true;
    this.teamService.addMember(this.selectedTeam.id, this.newMemberEmail, this.newMemberRole).subscribe({
      next: () => {
        this.notificationService.success('Member added successfully');
        this.newMemberEmail = '';
        this.newMemberRole = 'MEMBER';
        this.loadMembers(this.selectedTeam!.id!);
        this.addingMember = false;
      },
      error: (error) => {
        console.error('Error adding member:', error);
        this.notificationService.error(error.error?.message || 'Failed to add member');
        this.addingMember = false;
      }
    });
  }

  removeMember(member: TeamMember) {
    if (!this.selectedTeam?.id || !member.id) return;

    this.removingMember = true;
    this.teamService.removeMember(this.selectedTeam.id, member.id).subscribe({
      next: () => {
        this.notificationService.success('Member removed successfully');
        this.loadMembers(this.selectedTeam!.id!);
        this.removingMember = false;
      },
      error: (error) => {
        console.error('Error removing member:', error);
        this.notificationService.error(error.error?.message || 'Failed to remove member');
        this.removingMember = false;
      }
    });
  }
}
