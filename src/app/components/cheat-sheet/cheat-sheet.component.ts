import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface CheatItem {
  pattern: string;
  descriptionKey: string;
  exampleKey?: string;
}

interface CheatSection {
  titleKey: string;
  icon: string;
  items: CheatItem[];
}

@Component({
  selector: 'app-cheat-sheet',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="cheat-sheet-container">
      <div class="cheat-header">
        <h1>📖 {{ 'cheatSheet.title' | translate }}</h1>
        <p class="subtitle">{{ 'cheatSheet.subtitle' | translate }}</p>
      </div>

      <div class="sections-grid">
        <div class="section-card" *ngFor="let section of sections">
          <div class="section-header">
            <span class="section-icon">{{ section.icon }}</span>
            <h3>{{ section.titleKey | translate }}</h3>
          </div>

          <div class="items-list">
            <div class="cheat-item" *ngFor="let item of section.items">
              <div class="item-header">
                <code class="item-pattern">{{ item.pattern }}</code>
                <button
                  class="copy-btn"
                  (click)="copyToClipboard(item.pattern)"
                  [title]="'cheatSheet.copy' | translate">
                  📋
                </button>
              </div>
              <p class="item-description">{{ item.descriptionKey | translate }}</p>
              <code class="item-example" *ngIf="item.exampleKey">{{ item.exampleKey | translate }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cheat-sheet-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .cheat-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .cheat-header h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
    }

    .sections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .section-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .section-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--border-color);
    }

    .section-icon {
      font-size: 2rem;
    }

    .section-header h3 {
      font-size: 1.4rem;
      color: var(--text-primary);
      margin: 0;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cheat-item {
      background: var(--bg-primary);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
    }

    .cheat-item:hover {
      border-color: #3b82f6;
      transform: translateX(4px);
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .item-pattern {
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      color: #3b82f6;
      background: var(--bg-secondary);
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
    }

    .copy-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .copy-btn:hover {
      background: var(--bg-secondary);
      transform: scale(1.1);
    }

    .item-description {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 8px 0;
      line-height: 1.5;
    }

    .item-example {
      display: block;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      padding: 8px 12px;
      border-radius: 4px;
      margin-top: 8px;
      border-left: 3px solid #10b981;
    }

    @media (max-width: 768px) {
      .sections-grid {
        grid-template-columns: 1fr;
      }

      .cheat-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CheatSheetComponent {
  constructor(private translate: TranslateService) {}

  sections: CheatSection[] = [
    {
      titleKey: 'cheatSheet.sections.charClasses.title',
      icon: '🔤',
      items: [
        { pattern: '.', descriptionKey: 'cheatSheet.sections.charClasses.items.dot.description', exampleKey: 'cheatSheet.sections.charClasses.items.dot.example' },
        { pattern: '\\d', descriptionKey: 'cheatSheet.sections.charClasses.items.digit.description', exampleKey: 'cheatSheet.sections.charClasses.items.digit.example' },
        { pattern: '\\D', descriptionKey: 'cheatSheet.sections.charClasses.items.notDigit.description', exampleKey: 'cheatSheet.sections.charClasses.items.notDigit.example' },
        { pattern: '\\w', descriptionKey: 'cheatSheet.sections.charClasses.items.word.description', exampleKey: 'cheatSheet.sections.charClasses.items.word.example' },
        { pattern: '\\W', descriptionKey: 'cheatSheet.sections.charClasses.items.notWord.description', exampleKey: 'cheatSheet.sections.charClasses.items.notWord.example' },
        { pattern: '\\s', descriptionKey: 'cheatSheet.sections.charClasses.items.whitespace.description', exampleKey: 'cheatSheet.sections.charClasses.items.whitespace.example' },
        { pattern: '\\S', descriptionKey: 'cheatSheet.sections.charClasses.items.notWhitespace.description', exampleKey: 'cheatSheet.sections.charClasses.items.notWhitespace.example' },
        { pattern: '[abc]', descriptionKey: 'cheatSheet.sections.charClasses.items.set.description', exampleKey: 'cheatSheet.sections.charClasses.items.set.example' },
        { pattern: '[^abc]', descriptionKey: 'cheatSheet.sections.charClasses.items.negatedSet.description', exampleKey: 'cheatSheet.sections.charClasses.items.negatedSet.example' },
        { pattern: '[a-z]', descriptionKey: 'cheatSheet.sections.charClasses.items.range.description', exampleKey: 'cheatSheet.sections.charClasses.items.range.example' },
        { pattern: '[0-9]', descriptionKey: 'cheatSheet.sections.charClasses.items.digitRange.description', exampleKey: 'cheatSheet.sections.charClasses.items.digitRange.example' }
      ]
    },
    {
      titleKey: 'cheatSheet.sections.anchors.title',
      icon: '⚓',
      items: [
        { pattern: '^', descriptionKey: 'cheatSheet.sections.anchors.items.start.description', exampleKey: 'cheatSheet.sections.anchors.items.start.example' },
        { pattern: '$', descriptionKey: 'cheatSheet.sections.anchors.items.end.description', exampleKey: 'cheatSheet.sections.anchors.items.end.example' },
        { pattern: '\\b', descriptionKey: 'cheatSheet.sections.anchors.items.wordBoundary.description', exampleKey: 'cheatSheet.sections.anchors.items.wordBoundary.example' },
        { pattern: '\\B', descriptionKey: 'cheatSheet.sections.anchors.items.notWordBoundary.description', exampleKey: 'cheatSheet.sections.anchors.items.notWordBoundary.example' },
        { pattern: '\\A', descriptionKey: 'cheatSheet.sections.anchors.items.stringStart.description', exampleKey: 'cheatSheet.sections.anchors.items.stringStart.example' },
        { pattern: '\\Z', descriptionKey: 'cheatSheet.sections.anchors.items.stringEnd.description', exampleKey: 'cheatSheet.sections.anchors.items.stringEnd.example' }
      ]
    },
    {
      titleKey: 'cheatSheet.sections.quantifiers.title',
      icon: '🔢',
      items: [
        { pattern: '*', descriptionKey: 'cheatSheet.sections.quantifiers.items.zeroOrMore.description', exampleKey: 'cheatSheet.sections.quantifiers.items.zeroOrMore.example' },
        { pattern: '+', descriptionKey: 'cheatSheet.sections.quantifiers.items.oneOrMore.description', exampleKey: 'cheatSheet.sections.quantifiers.items.oneOrMore.example' },
        { pattern: '?', descriptionKey: 'cheatSheet.sections.quantifiers.items.zeroOrOne.description', exampleKey: 'cheatSheet.sections.quantifiers.items.zeroOrOne.example' },
        { pattern: '{n}', descriptionKey: 'cheatSheet.sections.quantifiers.items.exactlyN.description', exampleKey: 'cheatSheet.sections.quantifiers.items.exactlyN.example' },
        { pattern: '{n,}', descriptionKey: 'cheatSheet.sections.quantifiers.items.nOrMore.description', exampleKey: 'cheatSheet.sections.quantifiers.items.nOrMore.example' },
        { pattern: '{n,m}', descriptionKey: 'cheatSheet.sections.quantifiers.items.betweenNM.description', exampleKey: 'cheatSheet.sections.quantifiers.items.betweenNM.example' },
        { pattern: '*?', descriptionKey: 'cheatSheet.sections.quantifiers.items.lazyZeroOrMore.description', exampleKey: 'cheatSheet.sections.quantifiers.items.lazyZeroOrMore.example' },
        { pattern: '+?', descriptionKey: 'cheatSheet.sections.quantifiers.items.lazyOneOrMore.description', exampleKey: 'cheatSheet.sections.quantifiers.items.lazyOneOrMore.example' },
        { pattern: '??', descriptionKey: 'cheatSheet.sections.quantifiers.items.lazyZeroOrOne.description', exampleKey: 'cheatSheet.sections.quantifiers.items.lazyZeroOrOne.example' }
      ]
    },
    {
      titleKey: 'cheatSheet.sections.groups.title',
      icon: '🎯',
      items: [
        { pattern: '(abc)', descriptionKey: 'cheatSheet.sections.groups.items.capturing.description', exampleKey: 'cheatSheet.sections.groups.items.capturing.example' },
        { pattern: '(?:abc)', descriptionKey: 'cheatSheet.sections.groups.items.nonCapturing.description', exampleKey: 'cheatSheet.sections.groups.items.nonCapturing.example' },
        { pattern: '(?<name>abc)', descriptionKey: 'cheatSheet.sections.groups.items.named.description', exampleKey: 'cheatSheet.sections.groups.items.named.example' },
        { pattern: '\\1', descriptionKey: 'cheatSheet.sections.groups.items.backreference.description', exampleKey: 'cheatSheet.sections.groups.items.backreference.example' },
        { pattern: 'a|b', descriptionKey: 'cheatSheet.sections.groups.items.alternation.description', exampleKey: 'cheatSheet.sections.groups.items.alternation.example' },
        { pattern: '(?=abc)', descriptionKey: 'cheatSheet.sections.groups.items.positiveLookahead.description', exampleKey: 'cheatSheet.sections.groups.items.positiveLookahead.example' },
        { pattern: '(?!abc)', descriptionKey: 'cheatSheet.sections.groups.items.negativeLookahead.description', exampleKey: 'cheatSheet.sections.groups.items.negativeLookahead.example' },
        { pattern: '(?<=abc)', descriptionKey: 'cheatSheet.sections.groups.items.positiveLookbehind.description', exampleKey: 'cheatSheet.sections.groups.items.positiveLookbehind.example' },
        { pattern: '(?<!abc)', descriptionKey: 'cheatSheet.sections.groups.items.negativeLookbehind.description', exampleKey: 'cheatSheet.sections.groups.items.negativeLookbehind.example' }
      ]
    },
    {
      titleKey: 'cheatSheet.sections.flags.title',
      icon: '🚩',
      items: [
        { pattern: 'g', descriptionKey: 'cheatSheet.sections.flags.items.global.description', exampleKey: 'cheatSheet.sections.flags.items.global.example' },
        { pattern: 'i', descriptionKey: 'cheatSheet.sections.flags.items.caseInsensitive.description', exampleKey: 'cheatSheet.sections.flags.items.caseInsensitive.example' },
        { pattern: 'm', descriptionKey: 'cheatSheet.sections.flags.items.multiline.description', exampleKey: 'cheatSheet.sections.flags.items.multiline.example' },
        { pattern: 's', descriptionKey: 'cheatSheet.sections.flags.items.dotAll.description', exampleKey: 'cheatSheet.sections.flags.items.dotAll.example' },
        { pattern: 'u', descriptionKey: 'cheatSheet.sections.flags.items.unicode.description', exampleKey: 'cheatSheet.sections.flags.items.unicode.example' },
        { pattern: 'y', descriptionKey: 'cheatSheet.sections.flags.items.sticky.description', exampleKey: 'cheatSheet.sections.flags.items.sticky.example' }
      ]
    },
    {
      titleKey: 'cheatSheet.sections.escapes.title',
      icon: '🔐',
      items: [
        { pattern: '\\t', descriptionKey: 'cheatSheet.sections.escapes.items.tab.description' },
        { pattern: '\\n', descriptionKey: 'cheatSheet.sections.escapes.items.newline.description' },
        { pattern: '\\r', descriptionKey: 'cheatSheet.sections.escapes.items.carriageReturn.description' },
        { pattern: '\\v', descriptionKey: 'cheatSheet.sections.escapes.items.verticalTab.description' },
        { pattern: '\\f', descriptionKey: 'cheatSheet.sections.escapes.items.formFeed.description' },
        { pattern: '\\0', descriptionKey: 'cheatSheet.sections.escapes.items.null.description' },
        { pattern: '\\xhh', descriptionKey: 'cheatSheet.sections.escapes.items.hex.description', exampleKey: 'cheatSheet.sections.escapes.items.hex.example' },
        { pattern: '\\uhhhh', descriptionKey: 'cheatSheet.sections.escapes.items.unicode.description', exampleKey: 'cheatSheet.sections.escapes.items.unicode.example' },
        { pattern: '\\', descriptionKey: 'cheatSheet.sections.escapes.items.escape.description', exampleKey: 'cheatSheet.sections.escapes.items.escape.example' }
      ]
    },
    {
      titleKey: 'cheatSheet.sections.common.title',
      icon: '⭐',
      items: [
        { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', descriptionKey: 'cheatSheet.sections.common.items.email.description' },
        { pattern: '^https?:\\/\\/', descriptionKey: 'cheatSheet.sections.common.items.url.description' },
        { pattern: '^\\d{3}-\\d{3}-\\d{4}$', descriptionKey: 'cheatSheet.sections.common.items.phone.description' },
        { pattern: '^#[A-Fa-f0-9]{6}$', descriptionKey: 'cheatSheet.sections.common.items.hexColor.description' },
        { pattern: '^\\d{4}-\\d{2}-\\d{2}$', descriptionKey: 'cheatSheet.sections.common.items.date.description' },
        { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$', descriptionKey: 'cheatSheet.sections.common.items.password.description' },
        { pattern: '^[a-z0-9-]+$', descriptionKey: 'cheatSheet.sections.common.items.slug.description' },
        { pattern: '^\\d+\\.\\d+\\.\\d+$', descriptionKey: 'cheatSheet.sections.common.items.version.description' }
      ]
    }
  ];

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  }
}
