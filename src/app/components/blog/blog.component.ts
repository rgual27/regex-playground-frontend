import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="blog-container">
      <!-- Header Section -->
      <div class="blog-header">
        <h1>Regex Playground Blog</h1>
        <p class="subtitle">Learn regex patterns, best practices, and real-world applications</p>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search articles..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          *ngFor="let cat of categories"
          class="category-btn"
          [class.active]="selectedCategory === cat"
          (click)="filterByCategory(cat)">
          {{ cat }}
        </button>
      </div>

      <!-- Featured Posts -->
      <div class="featured-section" *ngIf="!searchQuery && selectedCategory === 'All' && featuredPosts.length > 0">
        <h2 class="section-title">Featured Articles</h2>
        <div class="featured-grid">
          <div
            *ngFor="let post of featuredPosts"
            class="featured-card"
            (click)="viewPost(post.slug)">
            <div class="featured-thumbnail">{{ post.thumbnail }}</div>
            <div class="featured-content">
              <div class="post-meta">
                <span class="category-badge">{{ post.category }}</span>
                <span class="read-time">{{ post.readTime }} min read</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p class="excerpt">{{ post.excerpt }}</p>
              <div class="post-footer">
                <span class="date">{{ formatDate(post.date) }}</span>
                <span class="author">{{ post.author.name }}</span>
              </div>
              <div class="tags">
                <span *ngFor="let tag of post.tags.slice(0, 3)" class="tag">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Posts Grid -->
      <div class="posts-section">
        <h2 class="section-title" *ngIf="searchQuery">
          Search Results ({{ filteredPosts.length }})
        </h2>
        <h2 class="section-title" *ngIf="!searchQuery && selectedCategory !== 'All'">
          {{ selectedCategory }}
        </h2>
        <h2 class="section-title" *ngIf="!searchQuery && selectedCategory === 'All' && featuredPosts.length > 0">
          All Articles
        </h2>

        <div class="posts-grid" *ngIf="filteredPosts.length > 0">
          <div
            *ngFor="let post of filteredPosts"
            class="post-card"
            (click)="viewPost(post.slug)">
            <div class="post-thumbnail">{{ post.thumbnail }}</div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category-badge">{{ post.category }}</span>
                <span class="read-time">{{ post.readTime }} min read</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p class="excerpt">{{ post.excerpt }}</p>
              <div class="post-footer">
                <span class="date">{{ formatDate(post.date) }}</span>
                <button class="read-more">Read More →</button>
              </div>
              <div class="tags">
                <span *ngFor="let tag of post.tags.slice(0, 3)" class="tag">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="no-results" *ngIf="filteredPosts.length === 0">
          <div class="no-results-icon">📭</div>
          <h3>No articles found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .blog-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .blog-header h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.3rem;
      color: var(--text-secondary);
    }

    .search-section {
      max-width: 600px;
      margin: 0 auto 40px;
    }

    .search-bar {
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 16px 50px 16px 20px;
      font-size: 1.1rem;
      border: 2px solid var(--border-color);
      border-radius: 50px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.3rem;
      pointer-events: none;
    }

    .category-filter {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 50px;
    }

    .category-btn {
      padding: 12px 28px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 25px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 1rem;
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

    .section-title {
      font-size: 2rem;
      margin-bottom: 30px;
      color: var(--text-primary);
      font-weight: 700;
    }

    .featured-section {
      margin-bottom: 60px;
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }

    .featured-card {
      background: var(--bg-secondary);
      border: 2px solid #3b82f6;
      border-radius: 16px;
      padding: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .featured-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    }

    .featured-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
      border-color: #8b5cf6;
    }

    .featured-thumbnail {
      font-size: 4rem;
      text-align: center;
      margin-bottom: 20px;
    }

    .featured-content h3 {
      font-size: 1.8rem;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }

    .post-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
    }

    .post-thumbnail {
      font-size: 3rem;
      text-align: center;
      margin-bottom: 20px;
    }

    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .category-badge {
      padding: 6px 14px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .read-time {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .post-content h3 {
      font-size: 1.5rem;
      margin-bottom: 12px;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .excerpt {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
      margin-bottom: 16px;
    }

    .date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .author {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .read-more {
      padding: 8px 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .read-more:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      padding: 4px 10px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .no-results {
      text-align: center;
      padding: 80px 20px;
    }

    .no-results-icon {
      font-size: 5rem;
      margin-bottom: 20px;
    }

    .no-results h3 {
      font-size: 1.8rem;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .no-results p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    @media (max-width: 1200px) {
      .featured-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .blog-header h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .posts-grid {
        grid-template-columns: 1fr;
      }

      .category-filter {
        gap: 8px;
      }

      .category-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
    }
  `]
})
export class BlogComponent implements OnInit {
  categories = ['All', 'Tutorials', 'Tips & Tricks', 'Use Cases', 'Advanced Patterns'];
  selectedCategory = 'All';
  searchQuery = '';

  allPosts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  featuredPosts: BlogPost[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getAllPosts().subscribe(posts => {
      this.allPosts = posts;
      this.filteredPosts = posts;
    });

    this.blogService.getFeaturedPosts().subscribe(posts => {
      this.featuredPosts = posts;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.searchQuery = '';

    if (category === 'All') {
      this.filteredPosts = this.allPosts;
    } else {
      this.blogService.getPostsByCategory(category).subscribe(posts => {
        this.filteredPosts = posts;
      });
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filterByCategory(this.selectedCategory);
      return;
    }

    this.blogService.searchPosts(this.searchQuery).subscribe(posts => {
      this.filteredPosts = posts;
    });
  }

  viewPost(slug: string) {
    this.router.navigate(['/blog', slug]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
