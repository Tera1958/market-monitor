from datetime import datetime, timezone

import feedparser
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session

from .base import BaseCrawler
from ..models import Article
from ..services.classifier import classify_content


class GoogleNewsCrawler(BaseCrawler):
    name = "googlenews"
    platform = "Google News"
    feed_urls = [
        "https://news.google.com/rss/search?q=AI+translation+earbuds+OR+transcription+device+OR+real-time+translator&hl=en-US&gl=US&ceid=US:en",
        "https://news.google.com/rss/search?q=AI+recorder+OR+smart+earbuds+translator+OR+meeting+transcription+hardware&hl=en-US&gl=US&ceid=US:en",
        "https://news.google.com/rss/search?q=AI%E7%BF%BB%E8%AF%91+OR+AI%E8%BD%AC%E5%BD%95+OR+%E7%BF%BB%E8%AF%91%E8%80%B3%E6%9C%BA+OR+%E5%BD%95%E9%9F%B3%E7%AC%94&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
        "https://news.google.com/rss/search?q=%E7%A7%91%E5%A4%A7%E8%AE%AF%E9%A3%9E+OR+%E6%97%B6%E7%A9%BA%E5%A3%B6+OR+Plaud+OR+%E5%A3%B0%E9%98%94&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    ]

    def crawl(self) -> list[dict]:
        items = []
        seen_urls = set()
        for url in self.feed_urls:
            try:
                response = self.fetch(url)
                feed = feedparser.parse(response.text)
                for entry in feed.entries[:30]:
                    link = entry.get("link", "")
                    if link in seen_urls:
                        continue
                    seen_urls.add(link)
                    items.append(self._parse_entry(entry))
            except Exception:
                continue
        return items

    def _parse_entry(self, entry) -> dict:
        published = None
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)

        summary = ""
        source_name = "Google News"
        if entry.get("summary"):
            soup = BeautifulSoup(entry.summary, "lxml")
            summary = soup.get_text(strip=True)[:500]
        if entry.get("source", {}).get("title"):
            source_name = entry.source.title

        return {
            "title": entry.get("title", ""),
            "summary": summary,
            "url": entry.get("link", ""),
            "published_at": published,
            "source_name": source_name,
        }

    def save_item(self, item: dict, db: Session) -> bool:
        existing = db.scalar(select(Article).where(Article.url == item["url"]))
        if existing:
            return False

        brands = self.detect_brands(item["title"] + " " + item.get("summary", ""))
        category = classify_content(item["title"], item.get("summary", ""))

        article = Article(
            title=item["title"],
            summary=item["summary"],
            url=item["url"],
            source_platform=self.platform,
            source_name=item.get("source_name", "Google News"),
            category=category,
            brands_mentioned={"brands": brands} if brands else None,
            published_at=item["published_at"],
        )
        db.add(article)
        return True
