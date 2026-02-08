import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface RegexPart {
  value: string;
  type: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-regex-explainer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="explainer-container" *ngIf="pattern">
      <div class="explainer-header">
        <h3>🔍 {{ 'explainer.title' | translate }}</h3>
        <p class="explainer-subtitle">{{ 'explainer.subtitle' | translate }}</p>
      </div>

      <div class="pattern-breakdown">
        <div class="pattern-visual">
          <span
            *ngFor="let part of parts"
            [class]="'part part-' + part.type"
            [style.background]="part.color"
            [title]="part.description">
            {{ part.value }}
          </span>
        </div>
      </div>

      <div class="parts-legend">
        <div class="legend-item" *ngFor="let part of parts">
          <div class="legend-color" [style.background]="part.color"></div>
          <div class="legend-content">
            <code class="legend-code">{{ part.value }}</code>
            <span class="legend-type">{{ part.type }}</span>
            <p class="legend-description">{{ part.description }}</p>
          </div>
        </div>
      </div>

      <div class="quick-tips" *ngIf="tips.length > 0">
        <h4>💡 {{ 'explainer.tips' | translate }}</h4>
        <ul>
          <li *ngFor="let tip of tips">{{ tip }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .explainer-container {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      margin-top: 20px;
    }

    .explainer-header {
      margin-bottom: 20px;
    }

    .explainer-header h3 {
      font-size: 1.5rem;
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .explainer-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .pattern-breakdown {
      background: var(--bg-primary);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
    }

    .pattern-visual {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
      line-height: 2;
    }

    .part {
      padding: 4px 8px;
      border-radius: 4px;
      color: #1a1a1a;
      font-weight: 600;
      cursor: help;
      transition: transform 0.2s ease;
      border: 2px solid rgba(0, 0, 0, 0.1);
    }

    .part:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    .parts-legend {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: var(--bg-primary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .legend-item:hover {
      border-color: #3b82f6;
      transform: translateX(4px);
    }

    .legend-color {
      width: 40px;
      min-width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 2px solid rgba(0, 0, 0, 0.1);
    }

    .legend-content {
      flex: 1;
    }

    .legend-code {
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      color: var(--text-primary);
      background: var(--bg-secondary);
      padding: 4px 8px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .legend-type {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .legend-description {
      margin-top: 8px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .quick-tips {
      margin-top: 24px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      border-radius: 8px;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .quick-tips h4 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .quick-tips ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .quick-tips li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .quick-tips li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #3b82f6;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .pattern-visual {
        font-size: 0.9rem;
      }

      .legend-item {
        flex-direction: column;
        gap: 12px;
      }

      .legend-color {
        width: 100%;
        height: 30px;
      }
    }
  `]
})
export class RegexExplainerComponent implements OnChanges {
  @Input() pattern: string = '';
  @Input() flags: string = '';

  parts: RegexPart[] = [];
  tips: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pattern'] || changes['flags']) {
      this.explainPattern();
    }
  }

  explainPattern() {
    if (!this.pattern) {
      this.parts = [];
      this.tips = [];
      return;
    }

    this.parts = this.parsePattern(this.pattern);
    this.tips = this.generateTips(this.pattern, this.flags);
  }

  parsePattern(pattern: string): RegexPart[] {
    const parts: RegexPart[] = [];
    let i = 0;

    while (i < pattern.length) {
      const char = pattern[i];

      // Character classes
      if (char === '[') {
        const end = pattern.indexOf(']', i);
        if (end !== -1) {
          parts.push({
            value: pattern.substring(i, end + 1),
            type: 'character-class',
            description: 'Character class: matches any single character from the set',
            color: '#fbbf24'
          });
          i = end + 1;
          continue;
        }
      }

      // Groups
      if (char === '(') {
        let depth = 1;
        let end = i + 1;
        while (end < pattern.length && depth > 0) {
          if (pattern[end] === '(' && pattern[end - 1] !== '\\') depth++;
          if (pattern[end] === ')' && pattern[end - 1] !== '\\') depth--;
          end++;
        }
        const groupContent = pattern.substring(i, end);
        const isCapturing = !groupContent.startsWith('(?:');
        const isLookahead = groupContent.startsWith('(?=') || groupContent.startsWith('(?!');
        parts.push({
          value: groupContent,
          type: isLookahead ? 'lookahead' : (isCapturing ? 'capturing-group' : 'non-capturing-group'),
          description: isLookahead ? 'Lookahead: asserts match without consuming characters' :
                       (isCapturing ? 'Capturing group: creates a numbered backreference' :
                        'Non-capturing group: groups without creating backreference'),
          color: isLookahead ? '#a78bfa' : (isCapturing ? '#10b981' : '#6ee7b7')
        });
        i = end;
        continue;
      }

      // Quantifiers
      if (['+', '*', '?'].includes(char)) {
        parts.push({
          value: char,
          type: 'quantifier',
          description: char === '+' ? 'One or more' :
                       char === '*' ? 'Zero or more' :
                       'Optional (zero or one)',
          color: '#f87171'
        });
        i++;
        continue;
      }

      // Ranges {n,m}
      if (char === '{') {
        const end = pattern.indexOf('}', i);
        if (end !== -1) {
          parts.push({
            value: pattern.substring(i, end + 1),
            type: 'quantifier',
            description: 'Quantifier: specifies exact number of repetitions',
            color: '#f87171'
          });
          i = end + 1;
          continue;
        }
      }

      // Anchors
      if (char === '^' || char === '$') {
        parts.push({
          value: char,
          type: 'anchor',
          description: char === '^' ? 'Start of line anchor' : 'End of line anchor',
          color: '#60a5fa'
        });
        i++;
        continue;
      }

      // Word boundaries
      if (char === '\\' && i + 1 < pattern.length) {
        const next = pattern[i + 1];
        if (next === 'b' || next === 'B') {
          parts.push({
            value: '\\' + next,
            type: 'anchor',
            description: next === 'b' ? 'Word boundary' : 'Non-word boundary',
            color: '#60a5fa'
          });
          i += 2;
          continue;
        }

        // Character escapes
        if (['d', 'D', 'w', 'W', 's', 'S', 't', 'n', 'r'].includes(next)) {
          const descriptions: {[key: string]: string} = {
            'd': 'Digit (0-9)',
            'D': 'Non-digit',
            'w': 'Word character (a-z, A-Z, 0-9, _)',
            'W': 'Non-word character',
            's': 'Whitespace',
            'S': 'Non-whitespace',
            't': 'Tab character',
            'n': 'Newline',
            'r': 'Carriage return'
          };
          parts.push({
            value: '\\' + next,
            type: 'escape',
            description: descriptions[next],
            color: '#fb923c'
          });
          i += 2;
          continue;
        }

        // Escaped special characters
        if (['\\', '.', '+', '*', '?', '[', ']', '(', ')', '{', '}', '|', '^', '$'].includes(next)) {
          parts.push({
            value: '\\' + next,
            type: 'literal',
            description: 'Escaped character: matches literal ' + next,
            color: '#cbd5e1'
          });
          i += 2;
          continue;
        }
      }

      // Dot wildcard
      if (char === '.') {
        parts.push({
          value: '.',
          type: 'wildcard',
          description: 'Wildcard: matches any character except newline',
          color: '#c084fc'
        });
        i++;
        continue;
      }

      // Alternation
      if (char === '|') {
        parts.push({
          value: '|',
          type: 'alternation',
          description: 'Alternation: matches either pattern on left or right',
          color: '#f472b6'
        });
        i++;
        continue;
      }

      // Literal characters
      parts.push({
        value: char,
        type: 'literal',
        description: 'Literal character: matches exactly "' + char + '"',
        color: '#cbd5e1'
      });
      i++;
    }

    return parts;
  }

  generateTips(pattern: string, flags: string): string[] {
    const tips: string[] = [];

    if (pattern.includes('+') || pattern.includes('*')) {
      tips.push('Quantifiers (* and +) are greedy by default. Add ? after them (e.g., *? or +?) to make them lazy.');
    }

    if (pattern.includes('(?:')) {
      tips.push('Using non-capturing groups (?:) improves performance when you don\'t need the matched value.');
    }

    if (pattern.includes('.') && !flags.includes('s')) {
      tips.push('The dot (.) doesn\'t match newlines. Use the "s" flag or [\\s\\S] to match any character including newlines.');
    }

    if (pattern.includes('^') && pattern.includes('$')) {
      tips.push('Using both ^ and $ anchors ensures the entire string must match your pattern.');
    }

    if (!flags.includes('g') && (pattern.includes('+') || pattern.includes('*'))) {
      tips.push('Add the "g" (global) flag to find all matches, not just the first one.');
    }

    if (pattern.includes('\\d') || pattern.includes('[0-9]')) {
      tips.push('For simple number validation, \\d+ matches one or more digits.');
    }

    if (pattern.includes('(?=') || pattern.includes('(?!')) {
      tips.push('Lookaheads (?= and ?!) check conditions without consuming characters in the match.');
    }

    return tips;
  }
}
