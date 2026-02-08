export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Tutorials' | 'Tips & Tricks' | 'Use Cases' | 'Advanced Patterns';
  date: Date;
  readTime: number;
  author: {
    name: string;
    avatar?: string;
  };
  thumbnail: string;
  tags: string[];
  relatedPosts: string[];
  featured?: boolean;
  seo?: {
    metaDescription: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  pattern?: {
    regex: string;
    flags: string;
    testString: string;
  };
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
}
