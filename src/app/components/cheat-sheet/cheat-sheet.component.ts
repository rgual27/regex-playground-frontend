import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface CheatItem {
  pattern: string;
  description: string;
  example?: string;
}

interface CheatSection {
  title: string;
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
            <h3>{{ section.title }}</h3>
          </div>

          <div class="items-list">
            <div class="cheat-item" *ngFor="let item of section.items">
              <div class="item-header">
                <code class="item-pattern">{{ item.pattern }}</code>
                <button
                  class="copy-btn"
                  (click)="copyToClipboard(item.pattern)"
                  title="Copy to clipboard">
                  📋
                </button>
              </div>
              <p class="item-description">{{ item.description }}</p>
              <code class="item-example" *ngIf="item.example">{{ item.example }}</code>
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
  sections: CheatSection[] = [
    {
      title: 'Character Classes',
      icon: '🔤',
      items: [
        { pattern: '.', description: 'Any character except newline' },
        { pattern: '\\d', description: 'Digit (0-9)', example: 'Matches: 0, 1, 2, ..., 9' },
        { pattern: '\\D', description: 'Not a digit', example: 'Matches: a, Z, !, etc.' },
        { pattern: '\\w', description: 'Word character (a-z, A-Z, 0-9, _)', example: 'Matches: a, Z, 5, _' },
        { pattern: '\\W', description: 'Not a word character', example: 'Matches: !, @, space' },
        { pattern: '\\s', description: 'Whitespace (space, tab, newline)', example: 'Matches: space, \\t, \\n' },
        { pattern: '\\S', description: 'Not whitespace', example: 'Matches: any non-space char' },
        { pattern: '[abc]', description: 'Any of a, b, or c', example: 'Matches: a, b, c' },
        { pattern: '[^abc]', description: 'Not a, b, or c', example: 'Matches: d, e, 1, etc.' },
        { pattern: '[a-z]', description: 'Character between a and z', example: 'Matches: a, b, ..., z' },
        { pattern: '[0-9]', description: 'Digit between 0 and 9', example: 'Same as \\d' }
      ]
    },
    {
      title: 'Anchors',
      icon: '⚓',
      items: [
        { pattern: '^', description: 'Start of string or line', example: '^Hello matches "Hello World"' },
        { pattern: '$', description: 'End of string or line', example: 'end$ matches "The end"' },
        { pattern: '\\b', description: 'Word boundary', example: '\\bcat\\b matches "cat" not "category"' },
        { pattern: '\\B', description: 'Not a word boundary', example: '\\Bcat matches "category"' },
        { pattern: '\\A', description: 'Start of string (not line)', example: 'Ignores multiline flag' },
        { pattern: '\\Z', description: 'End of string (not line)', example: 'Ignores multiline flag' }
      ]
    },
    {
      title: 'Quantifiers',
      icon: '🔢',
      items: [
        { pattern: '*', description: 'Zero or more', example: 'a* matches "", "a", "aa", "aaa"' },
        { pattern: '+', description: 'One or more', example: 'a+ matches "a", "aa", "aaa"' },
        { pattern: '?', description: 'Zero or one (optional)', example: 'colou?r matches "color" and "colour"' },
        { pattern: '{n}', description: 'Exactly n times', example: 'a{3} matches "aaa"' },
        { pattern: '{n,}', description: 'n or more times', example: 'a{2,} matches "aa", "aaa", etc.' },
        { pattern: '{n,m}', description: 'Between n and m times', example: 'a{2,4} matches "aa", "aaa", "aaaa"' },
        { pattern: '*?', description: 'Lazy zero or more', example: 'Matches as few as possible' },
        { pattern: '+?', description: 'Lazy one or more', example: 'Matches as few as possible' },
        { pattern: '??', description: 'Lazy zero or one', example: 'Matches as few as possible' }
      ]
    },
    {
      title: 'Groups & Alternation',
      icon: '🎯',
      items: [
        { pattern: '(abc)', description: 'Capturing group', example: '(\\d+) creates numbered backreference' },
        { pattern: '(?:abc)', description: 'Non-capturing group', example: 'Groups without capturing' },
        { pattern: '(?<name>abc)', description: 'Named capturing group', example: 'Creates named backreference' },
        { pattern: '\\1', description: 'Backreference to group 1', example: '(\\w)\\1 matches "aa", "bb"' },
        { pattern: 'a|b', description: 'Match a or b', example: 'cat|dog matches "cat" or "dog"' },
        { pattern: '(?=abc)', description: 'Positive lookahead', example: '\\d(?=px) matches "5" in "5px"' },
        { pattern: '(?!abc)', description: 'Negative lookahead', example: '\\d(?!px) matches "5" in "5em"' },
        { pattern: '(?<=abc)', description: 'Positive lookbehind', example: '(?<=\\$)\\d+ matches "10" in "$10"' },
        { pattern: '(?<!abc)', description: 'Negative lookbehind', example: '(?<!\\$)\\d+ matches "10" in "€10"' }
      ]
    },
    {
      title: 'Flags',
      icon: '🚩',
      items: [
        { pattern: 'g', description: 'Global (find all matches)', example: '/cat/g finds all "cat" occurrences' },
        { pattern: 'i', description: 'Case insensitive', example: '/cat/i matches "cat", "Cat", "CAT"' },
        { pattern: 'm', description: 'Multiline (^ and $ match line boundaries)', example: 'Each line treated separately' },
        { pattern: 's', description: 'Dot matches newline', example: '. can match \\n with this flag' },
        { pattern: 'u', description: 'Unicode', example: 'Proper Unicode character handling' },
        { pattern: 'y', description: 'Sticky (match from lastIndex)', example: 'Anchors to lastIndex position' }
      ]
    },
    {
      title: 'Escape Sequences',
      icon: '🔐',
      items: [
        { pattern: '\\t', description: 'Tab character' },
        { pattern: '\\n', description: 'Newline character' },
        { pattern: '\\r', description: 'Carriage return' },
        { pattern: '\\v', description: 'Vertical tab' },
        { pattern: '\\f', description: 'Form feed' },
        { pattern: '\\0', description: 'Null character' },
        { pattern: '\\xhh', description: 'Hex character code', example: '\\x41 matches "A"' },
        { pattern: '\\uhhhh', description: 'Unicode character', example: '\\u0041 matches "A"' },
        { pattern: '\\', description: 'Escape special character', example: '\\. matches literal "."' }
      ]
    },
    {
      title: 'Common Patterns',
      icon: '⭐',
      items: [
        { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: 'Email address' },
        { pattern: '^https?:\\/\\/', description: 'URL starting with http/https' },
        { pattern: '^\\d{3}-\\d{3}-\\d{4}$', description: 'US Phone number (123-456-7890)' },
        { pattern: '^#[A-Fa-f0-9]{6}$', description: 'Hex color code' },
        { pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Date (YYYY-MM-DD)' },
        { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$', description: 'Strong password (8+ chars, mixed case, digit)' },
        { pattern: '^[a-z0-9-]+$', description: 'URL slug' },
        { pattern: '^\\d+\\.\\d+\\.\\d+$', description: 'Version number (1.2.3)' }
      ]
    }
  ];

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  }
}
