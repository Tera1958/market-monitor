from datetime import datetime, timezone

import feedparser
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session

from .base import BaseCrawler
from ..models import Product
from ..services.classifier import classify_content


class ProductHuntCrawler(BaseCrawler):
    name = "producthunt"
    platform = "Product Hunt"
    feed_url = "https://www.producthunt.com/feed"

    def crawl(self) -> list[dict]:
        items = []
        try:
            response = self.fetch(self.feed_url)
            feed = feedparser.parse(response.text)
            for entry in feed.entries:
                if self.is_relevant(entry.get("title", "") + " " + entry.get("summary", "")):
                    items.append(self._parse_entry(entry))
        except Exception:
            pass
        return items

    def _parse_entry(self, entry) -> dict:
        published = None
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)

        summary = ""
        if entry.get("summary"):
            soup = BeautifulSoup(entry.summary, "lxml")
            summary = soup.get_text(strip=True)[:500]

        return {
            "name": entry.get("title", ""),
            "description": summary,
            "url": entry.get("link", ""),
            "published_at": published,
        }

    def save_item(self, item: dict, db: Session) -> bool:
        if not item.get("url"):
            return False

        existing = db.scalar(select(Product).where(Product.source_url == item["url"]))
        if existing:
            return False

        product = Product(
            name=item["name"],
            brand="Product Hunt",
            category="software",
            description=item.get("description"),
            source_platform=self.platform,
            source_url=item["url"],
        )
        db.add(product)
        return True
