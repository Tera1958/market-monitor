const API_BASE = "http://localhost:8001/api";

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Article {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  source_platform: string;
  source_name: string | null;
  category: string | null;
  brands_mentioned: Record<string, unknown> | null;
  published_at: string | null;
  crawled_at: string;
  thumbnail_url: string | null;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string | null;
  description: string | null;
  price: Record<string, string> | null;
  specs: Record<string, unknown> | null;
  source_platform: string;
  source_url: string;
  release_date: string | null;
  sales_rank: number | null;
  crawled_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface DashboardStats {
  total_articles: number;
  total_products: number;
  today_articles: number;
  today_products: number;
  active_brands: number;
  last_crawl_time: string | null;
  sources_count: Record<string, number>;
}

export interface CrawlLog {
  id: string;
  crawler_name: string;
  status: string;
  items_found: number;
  items_saved: number;
  started_at: string;
  finished_at: string | null;
  error_message: string | null;
}

export type CrawlStatus = Record<string, {
  last_status: string;
  last_run: string | null;
  items_saved: number;
}>;
