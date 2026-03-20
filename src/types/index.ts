export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_id: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  view_count: number;
  language: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  article_count: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  contributions: number;
  created_at: string;
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
  article_count: number;
}

export interface OracleMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
