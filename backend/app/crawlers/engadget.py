from datetime import datetime, timezone

import feedparser
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session

from .base import BaseCrawler
from ..models import Article
from ..services.classifier import classify_content


class EngadgetCrawler(BaseCrawler):
    name = "engadget"
    platform = "Engadget"
    feed_urls = [
        "https://www.engadget.com/rss.xml",
    ]

    def crawl(self) -> list[dict]:
        items = []
        for url in self.feed_urls:
            try:
                response = self.fetch(url)
                feed = feedparser.parse(response.text)
                for entry in feed.entries:
                    if self.is_relevant(entry.get("title", "") + " " + entry.get("summary", "")):
                        items.append(self._parse_entry(entry))
            except Exception:
                continue
        return items

    def _parse_entry(self, entry) -> dict:
        published = None
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)

        summary = ""
        if entry.get("summary"):
            soup = BeautifulSoup(entry.summary, "lxml")
            summary = soup.get_text(strip=True)[:500]

        thumbnail = None
        if entry.get("media_content"):
            thumbnail = entry.media_content[0].get("url")

        return {
            "title": entry.get("title", ""),
            "summary": summary,
            "url": entry.get("link", ""),
            "published_at": published,
            "thumbnail_url": thumbnail,
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
            source_name="Engadget",
            category=category,
            brands_mentioned={"brands": brands} if brands else None,
            published_at=item["published_at"],
            thumbnail_url=item.get("thumbnail_url"),
        )
        db.add(article)
        return True
