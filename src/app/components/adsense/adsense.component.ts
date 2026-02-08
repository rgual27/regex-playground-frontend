import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-adsense',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showAd" class="adsense-container">
      <ins class="adsbygoogle"
           [style.display]="display"
           [attr.data-ad-client]="adClient"
           [attr.data-ad-slot]="adSlot"
           [attr.data-ad-format]="adFormat"
           [attr.data-full-width-responsive]="responsive"></ins>
    </div>
  `,
  styles: [`
    .adsense-container {
      margin: 20px 0;
      text-align: center;
      min-height: 90px;
    }

    .adsbygoogle {
      display: block;
    }
  `]
})
export class AdsenseComponent implements OnInit, AfterViewInit {
  @Input() adSlot: string = '';
  @Input() adFormat: string = 'auto';
  @Input() display: string = 'block';
  @Input() responsive: string = 'true';

  adClient: string = 'ca-pub-XXXXXXXXXX'; // Replace with your AdSense Publisher ID
  showAd: boolean = false;
  isAuthenticated: boolean = false;
  currentTier: string = 'FREE';

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated;

    // Only show ads to FREE tier users
    if (this.isAuthenticated) {
      this.subscriptionService.getSubscriptionStatus().subscribe({
        next: (response) => {
          this.currentTier = response.tier || 'FREE';
          this.showAd = this.currentTier === 'FREE';
        },
        error: () => {
          this.showAd = true; // Show ad on error (assume FREE)
        }
      });
    } else {
      // Show ads to non-authenticated users
      this.showAd = true;
    }
  }

  ngAfterViewInit() {
    if (this.showAd) {
      try {
        // Push ad to AdSense
        setTimeout(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }, 100);
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }
}
