import random
import time
from abc import ABC, abstractmethod

import httpx
from sqlalchemy.orm import Session

from ..database import SessionLocal

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
]

KEYWORDS_EN = [
    "transcription", "translation", "speech-to-text", "real-time translation",
    "AI recorder", "voice recorder", "smart earbuds", "translator device",
    "meeting transcription", "note-taking AI", "language translation",
    "interpreter", "simultaneous translation", "voice AI", "speech recognition",
    "dictation", "multilingual", "translate", "subtitle", "captioning",
    "whisper", "deepl", "AI assistant", "smart office", "productivity AI",
    "earbuds", "wearable", "smart glasses", "AI hardware",
]

KEYWORDS_CN = [
    "转录", "翻译", "录音", "会议记录", "同声传译", "翻译机", "AI办公",
    "语音转文字", "多语言", "翻译耳机", "录音笔", "AI笔记", "实时翻译",
    "大模型", "语音识别", "智能硬件", "AI耳机", "商务办公",
]

KEYWORDS = KEYWORDS_EN + KEYWORDS_CN

BRAND_KEYWORDS = [
    "huawei", "华为", "xiaomi", "小米", "oppo", "apple", "苹果",
    "iflytek", "科大讯飞", "讯飞", "google", "谷歌", "cleer",
    "edifier", "漫步者", "vivo", "nank", "南卡", "samsung", "三星",
    "soundcore", "声阔", "anker", "安克", "plaud", "timekettle", "时空壶",
    "suunto", "颂拓", "mojie", "墨觉", "langsdom", "兰士顿",
    "honor", "荣耀", "newman", "纽曼", "dreame", "追觅",
]


class BaseCrawler(ABC):
    name: str = "base"
    platform: str = "unknown"

    def __init__(self):
        self.client = httpx.Client(
            headers={"User-Agent": random.choice(USER_AGENTS)},
            timeout=30,
            follow_redirects=True,
        )

    def run(self) -> dict:
        db = SessionLocal()
        try:
            items = self.crawl()
            saved = 0
            for item in items:
                if self.save_item(item, db):
                    saved += 1
            db.commit()
            return {"items_found": len(items), "items_saved": saved}
        finally:
            db.close()

    @abstractmethod
    def crawl(self) -> list[dict]:
        pass

    @abstractmethod
    def save_item(self, item: dict, db: Session) -> bool:
        pass

    def delay(self):
        time.sleep(random.uniform(1, 3))

    def fetch(self, url: str) -> httpx.Response:
        self.client.headers["User-Agent"] = random.choice(USER_AGENTS)
        response = self.client.get(url)
        response.raise_for_status()
        self.delay()
        return response

    def is_relevant(self, text: str) -> bool:
        text_lower = text.lower()
        return any(kw.lower() in text_lower for kw in KEYWORDS)

    def detect_brands(self, text: str) -> list[str]:
        text_lower = text.lower()
        found = []
        for brand in BRAND_KEYWORDS:
            if brand.lower() in text_lower:
                found.append(brand)
        return list(set(found))
