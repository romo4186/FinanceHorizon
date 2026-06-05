export interface Author {
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  role: string;
  credentials?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SectionContent {
  type: 'paragraph' | 'list' | 'table' | 'callout';
  text?: string; // Used for paragraphs and callout content
  items?: string[]; // Used for bullet/numbered lists
  headers?: string[]; // Used for table headers
  rows?: string[][]; // Used for table rows (array of cells)
  calloutType?: 'info' | 'warning' | 'tip'; // Type of banner/callout
}

export interface ArticleSection {
  id: string; // Used for Table of Contents anchor links
  title: string;
  content: SectionContent[];
}

export interface Article {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: 'credit-cards' | 'banking' | 'investing' | 'insurance';
  subtopics: string[];
  publishDate: string;
  readTime: string;
  author: Author;
  featuredImage: string;
  introduction: string; // Text content before the first ad/TOC block
  sections: ArticleSection[];
  faqs: FAQItem[];
  relatedSlugs: string[];
  content?: string;
  createdAt?: string;
}
