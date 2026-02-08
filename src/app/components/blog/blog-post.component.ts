import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="blog-post-container" *ngIf="post">
      <!-- Back Button -->
      <button class="back-btn" (click)="goBack()">
        ← Back to Blog
      </button>

      <!-- Post Header -->
      <article class="post-header">
        <div class="post-meta-top">
          <span class="category-badge">{{ post.category }}</span>
          <span class="read-time">{{ post.readTime }} min read</span>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-info">
          <div class="author-info">
            <span class="author-name">{{ post.author.name }}</span>
            <span class="post-date">{{ formatDate(post.date) }}</span>
          </div>
          <div class="share-buttons">
            <button class="share-btn twitter" (click)="shareOnTwitter()" title="Share on Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button class="share-btn linkedin" (click)="shareOnLinkedIn()" title="Share on LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button class="share-btn copy" (click)="copyLink()" title="Copy link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="tags-section">
          <span *ngFor="let tag of post.tags" class="tag">#{{ tag }}</span>
        </div>
      </article>

      <!-- Table of Contents -->
      <aside class="toc-container" *ngIf="tableOfContents.length > 0">
        <h3>Table of Contents</h3>
        <ul class="toc-list">
          <li *ngFor="let item of tableOfContents">
            <a [href]="'#' + item.id" (click)="scrollToSection(item.id, $event)">
              {{ item.text }}
            </a>
          </li>
        </ul>
      </aside>

      <!-- Post Content -->
      <div class="post-content" [innerHTML]="renderedContent"></div>

      <!-- Try It Button -->
      <div class="try-it-section" *ngIf="post.pattern">
        <button class="try-it-btn" (click)="tryPattern()">
          <span class="btn-icon">🚀</span>
          Try This Pattern in Regex Tester
        </button>
      </div>

      <!-- Related Posts -->
      <section class="related-posts" *ngIf="relatedPosts.length > 0">
        <h2>Related Articles</h2>
        <div class="related-grid">
          <div
            *ngFor="let related of relatedPosts"
            class="related-card"
            (click)="viewPost(related.slug)">
            <div class="related-thumbnail">{{ related.thumbnail }}</div>
            <div class="related-content">
              <span class="category-badge-small">{{ related.category }}</span>
              <h3>{{ related.title }}</h3>
              <p>{{ related.excerpt }}</p>
              <span class="read-more-link">Read More →</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!post && !notFound">
      <div class="spinner"></div>
      <p>Loading article...</p>
    </div>

    <!-- Not Found -->
    <div class="not-found" *ngIf="notFound">
      <div class="not-found-icon">📄</div>
      <h2>Article Not Found</h2>
      <p>The article you're looking for doesn't exist or has been moved.</p>
      <button class="back-btn" (click)="goBack()">← Back to Blog</button>
    </div>
  `,
  styles: [`
    .blog-post-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .back-btn {
      padding: 12px 24px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      margin-bottom: 30px;
    }

    .back-btn:hover {
      border-color: #3b82f6;
      transform: translateX(-4px);
    }

    .post-header {
      margin-bottom: 40px;
    }

    .post-meta-top {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
    }

    .category-badge {
      padding: 8px 16px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .read-time {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .post-title {
      font-size: 3rem;
      line-height: 1.2;
      margin-bottom: 24px;
      color: var(--text-primary);
      font-weight: 800;
    }

    .post-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 20px;
    }

    .author-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .author-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .post-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .share-buttons {
      display: flex;
      gap: 12px;
    }

    .share-btn {
      width: 44px;
      height: 44px;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .share-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .share-btn.twitter:hover {
      background: #1DA1F2;
      border-color: #1DA1F2;
      color: white;
    }

    .share-btn.linkedin:hover {
      background: #0077B5;
      border-color: #0077B5;
      color: white;
    }

    .share-btn.copy:hover {
      background: #10b981;
      border-color: #10b981;
      color: white;
    }

    .tags-section {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tag {
      padding: 6px 14px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .toc-container {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 40px;
    }

    .toc-container h3 {
      font-size: 1.3rem;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-list li {
      margin-bottom: 12px;
    }

    .toc-list a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;
      display: block;
      padding: 8px 12px;
      border-radius: 6px;
    }

    .toc-list a:hover {
      color: #3b82f6;
      background: var(--bg-primary);
      padding-left: 20px;
    }

    .post-content {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-primary);
      margin-bottom: 50px;
    }

    .post-content :deep(h1),
    .post-content :deep(h2),
    .post-content :deep(h3) {
      color: var(--text-primary);
      margin-top: 40px;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .post-content :deep(h1) {
      font-size: 2.5rem;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 12px;
    }

    .post-content :deep(h2) {
      font-size: 2rem;
    }

    .post-content :deep(h3) {
      font-size: 1.5rem;
    }

    .post-content :deep(p) {
      margin-bottom: 20px;
    }

    .post-content :deep(code) {
      background: var(--bg-secondary);
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.95em;
      color: #3b82f6;
      border: 1px solid var(--border-color);
    }

    .post-content :deep(pre) {
      background: var(--bg-secondary);
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      border: 2px solid var(--border-color);
      margin: 24px 0;
    }

    .post-content :deep(pre code) {
      background: none;
      padding: 0;
      border: none;
      color: var(--text-primary);
    }

    .post-content :deep(ul),
    .post-content :deep(ol) {
      margin-bottom: 20px;
      padding-left: 30px;
    }

    .post-content :deep(li) {
      margin-bottom: 10px;
    }

    .post-content :deep(blockquote) {
      border-left: 4px solid #3b82f6;
      padding-left: 20px;
      margin: 24px 0;
      color: var(--text-secondary);
      font-style: italic;
    }

    .post-content :deep(strong) {
      color: var(--text-primary);
      font-weight: 700;
    }

    .try-it-section {
      margin: 50px 0;
      text-align: center;
    }

    .try-it-btn {
      padding: 18px 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
    }

    .try-it-btn:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
    }

    .btn-icon {
      font-size: 1.5rem;
    }

    .related-posts {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 2px solid var(--border-color);
    }

    .related-posts h2 {
      font-size: 2rem;
      margin-bottom: 30px;
      color: var(--text-primary);
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .related-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .related-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
    }

    .related-thumbnail {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 16px;
    }

    .category-badge-small {
      padding: 4px 10px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 12px;
    }

    .related-content h3 {
      font-size: 1.2rem;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .related-content p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .read-more-link {
      color: #3b82f6;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 20px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--border-color);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .not-found {
      text-align: center;
      padding: 80px 20px;
    }

    .not-found-icon {
      font-size: 5rem;
      margin-bottom: 20px;
    }

    .not-found h2 {
      font-size: 2rem;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .not-found p {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .post-title {
        font-size: 2rem;
      }

      .post-info {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
      }

      .share-buttons {
        width: 100%;
        justify-content: flex-start;
      }

      .related-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BlogPostComponent implements OnInit {
  post: BlogPost | null = null;
  relatedPosts: BlogPost[] = [];
  notFound = false;
  renderedContent: SafeHtml = '';
  tableOfContents: { id: string; text: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadPost(slug);
    });
  }

  loadPost(slug: string) {
    this.blogService.getPostBySlug(slug).subscribe(post => {
      if (post) {
        this.post = post;
        this.setSEO(post);
        this.renderContent();
        this.extractTableOfContents();
        this.loadRelatedPosts(post.id);
      } else {
        this.notFound = true;
      }
    });
  }

  renderContent() {
    if (!this.post) return;

    // Simple markdown-like rendering
    let html = this.post.content;

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Lists
    html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraphs
    html = html.replace(/^(?!<[hul]|```|<pre)((.+?))\n/gm, '<p>$1</p>');

    // Warning blocks
    html = html.replace(/⚠️ \*\*(.+?)\*\*:/g, '<blockquote><strong>⚠️ $1:</strong>');
    html = html.replace(/<\/blockquote>\n\n/g, '</blockquote>');

    this.renderedContent = this.sanitizer.sanitize(1, html) || '';
  }

  extractTableOfContents() {
    if (!this.post) return;

    const headers = this.post.content.match(/^## (.+)$/gm);
    if (headers) {
      this.tableOfContents = headers.map(header => {
        const text = header.replace('## ', '');
        const id = text.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
        return { id, text };
      });
    }
  }

  loadRelatedPosts(postId: string) {
    this.blogService.getRelatedPosts(postId).subscribe(posts => {
      this.relatedPosts = posts;
    });
  }

  setSEO(post: BlogPost) {
    // Set page title
    this.titleService.setTitle(`${post.title} | Regex Playground Blog`);

    // Set meta description
    this.metaService.updateTag({
      name: 'description',
      content: post.seo?.metaDescription || post.excerpt
    });

    // Open Graph tags
    this.metaService.updateTag({
      property: 'og:title',
      content: post.seo?.ogTitle || post.title
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: post.seo?.ogDescription || post.excerpt
    });

    this.metaService.updateTag({
      property: 'og:type',
      content: 'article'
    });

    // Twitter Card tags
    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.metaService.updateTag({
      name: 'twitter:title',
      content: post.title
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content: post.excerpt
    });

    // Article tags
    this.metaService.updateTag({
      property: 'article:published_time',
      content: post.date.toISOString()
    });

    this.metaService.updateTag({
      property: 'article:author',
      content: post.author.name
    });

    post.tags.forEach(tag => {
      this.metaService.addTag({
        property: 'article:tag',
        content: tag
      });
    });
  }

  tryPattern() {
    if (!this.post?.pattern) return;

    this.router.navigate(['/'], {
      queryParams: {
        pattern: this.post.pattern.regex,
        flags: this.post.pattern.flags,
        test: this.post.pattern.testString,
        from: 'blog'
      }
    });
  }

  shareOnTwitter() {
    if (!this.post) return;

    const url = window.location.href;
    const text = `${this.post.title} - Regex Playground`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }

  shareOnLinkedIn() {
    if (!this.post) return;

    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  }

  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  }

  scrollToSection(id: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  viewPost(slug: string) {
    this.router.navigate(['/blog', slug]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    this.router.navigate(['/blog']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
