import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface RegexExample {
  id: string;
  title: string;
  description: string;
  pattern: string;
  flags: string;
  testString: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  useCases: string[];
}

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="examples-container">
      <div class="examples-header">
        <h1>📚 {{ 'examples.title' | translate }}</h1>
        <p class="subtitle">{{ 'examples.subtitle' | translate }}</p>
      </div>

      <div class="category-filter">
        <button
          *ngFor="let cat of categories"
          class="category-btn"
          [class.active]="selectedCategory === cat"
          (click)="selectedCategory = cat">
          {{ cat }}
        </button>
      </div>

      <div class="examples-grid">
        <div
          *ngFor="let example of filteredExamples"
          class="example-card"
          [class.beginner]="example.difficulty === 'beginner'"
          [class.intermediate]="example.difficulty === 'intermediate'"
          [class.advanced]="example.difficulty === 'advanced'"
          (click)="tryExample(example)">

          <div class="example-header">
            <h3>{{ example.title }}</h3>
            <span class="difficulty-badge" [class]="example.difficulty">
              {{ example.difficulty }}
            </span>
          </div>

          <p class="example-description">{{ example.description }}</p>

          <div class="example-pattern">
            <code>/{{ example.pattern }}/{{ example.flags }}</code>
          </div>

          <div class="example-meta">
            <span class="category-tag">{{ example.category }}</span>
            <button class="try-btn">
              🚀 {{ 'examples.tryIt' | translate }}
            </button>
          </div>

          <div class="use-cases">
            <div class="use-case" *ngFor="let useCase of example.useCases.slice(0, 2)">
              ✓ {{ useCase }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .examples-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .examples-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .examples-header h1 {
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

    .category-filter {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }

    .category-btn {
      padding: 10px 24px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 25px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .category-btn:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .category-btn.active {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-color: #3b82f6;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .example-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .example-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #10b981 0%, #059669 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .example-card.intermediate::before {
      background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    }

    .example-card.advanced::before {
      background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
    }

    .example-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
    }

    .example-card:hover::before {
      opacity: 1;
    }

    .example-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .example-header h3 {
      font-size: 1.3rem;
      color: var(--text-primary);
      margin: 0;
    }

    .difficulty-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .difficulty-badge.beginner {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .difficulty-badge.intermediate {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    .difficulty-badge.advanced {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .example-description {
      color: var(--text-secondary);
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .example-pattern {
      background: var(--bg-primary);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid var(--border-color);
    }

    .example-pattern code {
      color: #3b82f6;
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
      word-break: break-all;
    }

    .example-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .category-tag {
      padding: 6px 12px;
      background: var(--bg-primary);
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }

    .try-btn {
      padding: 8px 16px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .try-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .use-cases {
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
    }

    .use-case {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .examples-grid {
        grid-template-columns: 1fr;
      }

      .examples-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ExamplesComponent implements OnInit {
  categories = ['All', 'Validation', 'Extraction', 'Search', 'Formatting'];
  selectedCategory = 'All';

  examples: RegexExample[] = [
    {
      id: 'email',
      title: 'Email Validation',
      description: 'Validate email addresses with proper format checking',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      flags: 'i',
      testString: 'user@example.com\ntest.email+tag@domain.co.uk\ninvalid@\n@invalid.com',
      category: 'Validation',
      difficulty: 'beginner',
      explanation: 'Matches standard email format with username, @ symbol, domain, and TLD',
      useCases: ['Form validation', 'User registration', 'Contact forms', 'Newsletter signup']
    },
    {
      id: 'url',
      title: 'URL/Link Extractor',
      description: 'Extract HTTP/HTTPS URLs from text',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      flags: 'gi',
      testString: 'Visit https://example.com or http://test.org for more info',
      category: 'Extraction',
      difficulty: 'intermediate',
      explanation: 'Extracts complete URLs including protocol, domain, and path',
      useCases: ['Link extraction', 'Web scraping', 'Content analysis', 'SEO tools']
    },
    {
      id: 'phone-us',
      title: 'US Phone Number',
      description: 'Match US phone numbers in various formats',
      pattern: '(\\+1[-\\s]?)?(\\([0-9]{3}\\)|[0-9]{3})[-\\s]?[0-9]{3}[-\\s]?[0-9]{4}',
      flags: 'g',
      testString: '+1 (555) 123-4567\n555-123-4567\n(555) 1234567\n5551234567',
      category: 'Validation',
      difficulty: 'beginner',
      explanation: 'Matches US phone numbers with optional country code and various separators',
      useCases: ['Contact forms', 'Customer database', 'CRM systems', 'SMS services']
    },
    {
      id: 'date',
      title: 'Date Format (YYYY-MM-DD)',
      description: 'Match ISO date format',
      pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])',
      flags: 'g',
      testString: '2024-01-15\n2024-12-31\n2024-13-01 (invalid)\n2024-02-30 (invalid)',
      category: 'Validation',
      difficulty: 'intermediate',
      explanation: 'Validates dates in YYYY-MM-DD format with month (01-12) and day (01-31) ranges',
      useCases: ['Date input validation', 'Log parsing', 'Data import', 'API validation']
    },
    {
      id: 'hex-color',
      title: 'Hex Color Code',
      description: 'Match hexadecimal color codes',
      pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})',
      flags: 'gi',
      testString: '#FFF\n#FFFFFF\n#3b82f6\n#abc\nRGB(255,0,0)',
      category: 'Extraction',
      difficulty: 'beginner',
      explanation: 'Matches 3 or 6 digit hex color codes with # prefix',
      useCases: ['CSS parsing', 'Design tools', 'Color extraction', 'Theme generation']
    },
    {
      id: 'ipv4',
      title: 'IPv4 Address',
      description: 'Match valid IPv4 addresses',
      pattern: '\\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      flags: 'g',
      testString: '192.168.1.1\n255.255.255.0\n8.8.8.8\n256.1.1.1 (invalid)',
      category: 'Validation',
      difficulty: 'advanced',
      explanation: 'Validates IPv4 addresses ensuring each octet is 0-255',
      useCases: ['Network configuration', 'Server logs', 'Security tools', 'IP filtering']
    },
    {
      id: 'credit-card',
      title: 'Credit Card Number',
      description: 'Match credit card numbers (13-19 digits)',
      pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b',
      flags: 'g',
      testString: '4532-1234-5678-9010\n4532 1234 5678 9010\n4532123456789010',
      category: 'Validation',
      difficulty: 'intermediate',
      explanation: 'Matches 16-digit card numbers with optional separators',
      useCases: ['Payment forms', 'PCI compliance', 'Transaction validation', 'Financial systems']
    },
    {
      id: 'password',
      title: 'Strong Password',
      description: 'Validate strong passwords (8+ chars, mixed case, numbers, symbols)',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      flags: '',
      testString: 'Weak123\nStrong@123\nP@ssw0rd\ntest',
      category: 'Validation',
      difficulty: 'advanced',
      explanation: 'Uses lookaheads to ensure password contains lowercase, uppercase, digit, and special character',
      useCases: ['User registration', 'Security enforcement', 'Password reset', 'Account creation']
    },
    {
      id: 'html-tags',
      title: 'HTML Tag Remover',
      description: 'Remove all HTML tags from text',
      pattern: '<[^>]*>',
      flags: 'gi',
      testString: '<div>Hello <strong>World</strong></div>\n<p>Test</p>',
      category: 'Formatting',
      difficulty: 'beginner',
      explanation: 'Matches any HTML tag including opening and closing tags',
      useCases: ['Text sanitization', 'Plain text extraction', 'Content cleaning', 'SEO analysis']
    },
    {
      id: 'twitter-handle',
      title: 'Twitter/X Handle',
      description: 'Extract Twitter/X usernames',
      pattern: '@[A-Za-z0-9_]{1,15}\\b',
      flags: 'g',
      testString: 'Follow @username and @test_user for updates! @a',
      category: 'Extraction',
      difficulty: 'beginner',
      explanation: 'Matches @ followed by 1-15 alphanumeric characters or underscores',
      useCases: ['Social media analysis', 'Mention detection', 'User tagging', 'Content monitoring']
    },
    {
      id: 'hashtag',
      title: 'Hashtag Extractor',
      description: 'Extract hashtags from social media text',
      pattern: '#[A-Za-z0-9_]+\\b',
      flags: 'g',
      testString: 'Check out #coding #webdev #javascript for tips!',
      category: 'Extraction',
      difficulty: 'beginner',
      explanation: 'Matches # followed by alphanumeric characters and underscores',
      useCases: ['Trending topics', 'Content categorization', 'Social media analytics', 'Campaign tracking']
    },
    {
      id: 'markdown-links',
      title: 'Markdown Links',
      description: 'Extract markdown link syntax',
      pattern: '\\[([^\\]]+)\\]\\(([^\\)]+)\\)',
      flags: 'g',
      testString: 'Check [Google](https://google.com) and [GitHub](https://github.com)',
      category: 'Extraction',
      difficulty: 'intermediate',
      explanation: 'Captures both link text and URL from markdown format',
      useCases: ['Documentation parsing', 'Link validation', 'Content migration', 'Static site generators']
    },
    {
      id: 'slug',
      title: 'URL Slug Validator',
      description: 'Validate URL-friendly slugs',
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
      flags: '',
      testString: 'my-blog-post\nvalid-slug-123\ninvalid_slug\nInvalidSlug',
      category: 'Validation',
      difficulty: 'beginner',
      explanation: 'Matches lowercase letters, numbers, and hyphens (no consecutive hyphens)',
      useCases: ['CMS systems', 'Blog URLs', 'SEO optimization', 'Route generation']
    },
    {
      id: 'json-string',
      title: 'JSON String Value',
      description: 'Extract string values from JSON',
      pattern: '"([^"\\\\]|\\\\.)*"',
      flags: 'g',
      testString: '{"name": "John", "email": "test@example.com", "age": 30}',
      category: 'Extraction',
      difficulty: 'advanced',
      explanation: 'Matches JSON string values including escaped characters',
      useCases: ['API parsing', 'Config file reading', 'Data extraction', 'Log analysis']
    },
    {
      id: 'whitespace',
      title: 'Multiple Whitespace',
      description: 'Replace multiple spaces with single space',
      pattern: '\\s+',
      flags: 'g',
      testString: 'Too    many     spaces    here',
      category: 'Formatting',
      difficulty: 'beginner',
      explanation: 'Matches one or more whitespace characters',
      useCases: ['Text normalization', 'Data cleaning', 'Input sanitization', 'Format fixing']
    },
    {
      id: 'file-extension',
      title: 'File Extension',
      description: 'Extract file extensions from filenames',
      pattern: '\\.([a-zA-Z0-9]+)$',
      flags: '',
      testString: 'document.pdf\nimage.jpg\nscript.js\nfile.tar.gz',
      category: 'Extraction',
      difficulty: 'beginner',
      explanation: 'Matches the last dot and following characters at end of string',
      useCases: ['File type validation', 'Upload filtering', 'File organization', 'MIME type detection']
    },
    {
      id: 'semver',
      title: 'Semantic Version',
      description: 'Match semantic versioning (major.minor.patch)',
      pattern: '\\b(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?\\b',
      flags: 'g',
      testString: 'v1.0.0\n2.3.4-beta.1\n0.0.1+build.123',
      category: 'Validation',
      difficulty: 'advanced',
      explanation: 'Validates semantic version format including pre-release and build metadata',
      useCases: ['Package management', 'Version comparison', 'Release automation', 'Dependency checking']
    },
    {
      id: 'uuid',
      title: 'UUID Validator',
      description: 'Match UUID v4 format',
      pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
      flags: 'g',
      testString: '550e8400-e29b-41d4-a716-446655440000\n123e4567-e89b-12d3-a456-426614174000',
      category: 'Validation',
      difficulty: 'advanced',
      explanation: 'Validates UUID v4 format with proper version and variant bits',
      useCases: ['Database IDs', 'API tokens', 'Unique identifiers', 'Distributed systems']
    }
  ];

  filteredExamples: RegexExample[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterExamples();
  }

  filterExamples() {
    if (this.selectedCategory === 'All') {
      this.filteredExamples = this.examples;
    } else {
      this.filteredExamples = this.examples.filter(ex => ex.category === this.selectedCategory);
    }
  }

  tryExample(example: RegexExample) {
    // Navigate to home with query params
    this.router.navigate(['/'], {
      queryParams: {
        pattern: example.pattern,
        flags: example.flags,
        test: example.testString,
        example: example.id
      }
    });
  }
}
