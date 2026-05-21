import hashlib


def content_hash(title: str, url: str) -> str:
    text = f"{title.strip().lower()}|{url.strip().lower()}"
    return hashlib.md5(text.encode()).hexdigest()
