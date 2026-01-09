import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCheckoutSession(tier: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${this.apiUrl}/api/subscriptions/checkout`,
      null,
      { params: { tier } }
    );
  }

  getSubscriptionStatus(): Observable<{ tier: string }> {
    return this.http.get<{ tier: string }>(`${this.apiUrl}/api/subscriptions/status`);
  }

  cancelSubscription(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/api/subscriptions/cancel`, {});
  }
}
