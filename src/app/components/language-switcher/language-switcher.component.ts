import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button class="language-button" (click)="toggleDropdown()">
        <span class="flag">{{ currentLanguage.flag }}</span>
        <span class="language-name">{{ currentLanguage.name }}</span>
        <span class="arrow">▼</span>
      </button>

      <div class="language-dropdown" *ngIf="isOpen">
        <button
          *ngFor="let lang of languages"
          class="language-option"
          [class.active]="lang.code === currentLanguage.code"
          (click)="changeLanguage(lang)">
          <span class="flag">{{ lang.flag }}</span>
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

      &:hover {
        background-color: var(--bg-secondary);
        border-color: var(--primary-color);
      }
    }

    .flag {
      font-size: 1.25rem;
    }

    .language-name {
      font-weight: 500;
    }

    .arrow {
      font-size: 0.75rem;
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
      min-width: 180px;
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

        .flag {
          filter: brightness(1.2);
        }
      }
    }

    @media (max-width: 768px) {
      .language-name {
        display: none;
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  isOpen = false;

  languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  currentLanguage: Language;

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLanguage = this.languages.find(l => l.code === savedLang) || this.languages[0];
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
