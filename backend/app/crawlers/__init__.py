from .base import BaseCrawler
from .techcrunch import TechCrunchCrawler
from .theverge import TheVergeCrawler
from .googlenews import GoogleNewsCrawler
from .producthunt import ProductHuntCrawler
from .engadget import EngadgetCrawler
from .tomshardware import TomsHardwareCrawler

CRAWLERS = {
    "techcrunch": TechCrunchCrawler,
    "theverge": TheVergeCrawler,
    "googlenews": GoogleNewsCrawler,
    "producthunt": ProductHuntCrawler,
    "engadget": EngadgetCrawler,
    "tomshardware": TomsHardwareCrawler,
}


def get_crawler(name: str) -> BaseCrawler | None:
    cls = CRAWLERS.get(name)
    if cls:
        return cls()
    return None


def get_all_crawler_names() -> list[str]:
    return list(CRAWLERS.keys())
