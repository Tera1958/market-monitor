import useSWR from "swr";
import { fetchAPI, DashboardStats, PaginatedResponse, Article, Product, CrawlStatus, CrawlLog } from "./api";

const fetcher = <T>(path: string) => fetchAPI<T>(path);

export function useDashboard() {
  return useSWR<DashboardStats>("/dashboard/stats", fetcher);
}

export function useArticles(params: Record<string, string | number>) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined).map(([k, v]) => [k, String(v)])
  ).toString();
  return useSWR<PaginatedResponse<Article>>(`/articles?${query}`, fetcher);
}

export function useProducts(params: Record<string, string | number>) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined).map(([k, v]) => [k, String(v)])
  ).toString();
  return useSWR<PaginatedResponse<Product>>(`/products?${query}`, fetcher);
}

export function useCrawlStatus() {
  return useSWR<CrawlStatus>("/crawl/status", fetcher, { refreshInterval: 5000 });
}

export function useCrawlLogs() {
  return useSWR<CrawlLog[]>("/crawl/logs", fetcher, { refreshInterval: 5000 });
}
