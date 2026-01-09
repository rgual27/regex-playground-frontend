import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button class="language-button" (click)="toggleDropdown()">
        <span class="language-code">{{ currentLanguage.code.toUpperCase() }}</span>
        <span class="arrow" *ngIf="isOpen">▲</span>
        <span class="arrow" *ngIf="!isOpen">▼</span>
      </button>

      <div class="language-dropdown" *ngIf="isOpen">
        <button
          *ngFor="let lang of languages"
          class="language-option"
          [class.active]="lang.code === currentLanguage.code"
          (click)="changeLanguage(lang)">
          <span class="language-code">{{ lang.code.toUpperCase() }}</span>
          <span class="language-name">{{ lang.name }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .language-switcher {
      position: relative;
      display: inline-block;
    }

    .language-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
      color: var(--text-primary);
      min-width: 65px;

      &:hover {
        background-color: var(--bg-secondary);
        border-color: var(--primary-color);
      }
    }

    .language-code {
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
    }

    .arrow {
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .language-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      min-width: 160px;
      z-index: 1000;
      overflow: hidden;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
      color: var(--text-primary);
      text-align: left;

      &:hover {
        background-color: var(--bg-secondary);
      }

      &.active {
        background-color: var(--primary-color);
        color: white;

        .language-code {
          font-weight: 800;
        }
      }

      .language-code {
        font-weight: 700;
        min-width: 25px;
      }

      .language-name {
        font-weight: 500;
      }
    }
  `]
})
export class LanguageSwitcherComponent implements OnInit {
  isOpen = false;

  languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' }
  ];

  currentLanguage: Language;

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLanguage = this.languages.find(l => l.code === savedLang) || this.languages[0];
  }

  ngOnInit() {
    // Ensure the translate service uses the saved language
    this.translate.use(this.currentLanguage.code);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.language-switcher');
    if (!clickedInside && this.isOpen) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  changeLanguage(language: Language) {
    this.currentLanguage = language;
    this.translate.use(language.code);
    localStorage.setItem('language', language.code);
    this.isOpen = false;
  }
}
