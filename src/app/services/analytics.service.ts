import { Injectable, ApplicationRef, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { inject } from '@vercel/analytics';

/**
 * Analytics Service
 * 
 * Integrates Vercel Web Analytics with the Angular application.
 * 
 * In development mode, analytics collection is disabled to avoid polluting production data.
 * In production mode, analytics is automatically initialized and route changes are tracked.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

  constructor(private router: Router, private appRef: ApplicationRef) {
    this.initializeAnalytics();
  }

  /**
   * Initialize Vercel Web Analytics
   * 
   * - Inject the analytics script into the page
   * - Track route navigation changes
   * - Only run in production environment
   */
  private initializeAnalytics(): void {
    // Skip analytics initialization in development
    if (!this.isProduction) {
      console.debug('Analytics disabled in development mode');
      return;
    }

    // Inject the analytics script
    try {
      inject();
      console.debug('Vercel Web Analytics initialized');
    } catch (error) {
      console.warn('Failed to initialize Vercel Web Analytics:', error);
    }

    // Track route navigation
    this.trackRouteChanges();
  }

  /**
   * Track route navigation changes
   * 
   * This ensures that page views are recorded for client-side route changes
   */
  private trackRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Log route change for analytics tracking
        if (typeof window !== 'undefined' && (window as any).va) {
          (window as any).va('pageview', { path: event.urlAfterRedirects });
        }
      });
  }
}
