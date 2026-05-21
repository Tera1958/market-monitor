CATEGORY_KEYWORDS = {
    "transcription": [
        "转录", "录音", "transcription", "speech-to-text", "recorder",
        "meeting notes", "会议记录", "语音转文字", "dictation", "whisper",
        "录音笔", "note-taking", "minutes", "caption", "subtitle",
    ],
    "translation": [
        "翻译", "translation", "translator", "interpret", "同声传译",
        "多语言", "multilingual", "翻译机", "翻译耳机", "real-time translation",
        "language barrier", "cross-language", "deepl", "interpreter",
    ],
    "hardware": [
        "耳机", "earbuds", "headphone", "device", "硬件", "录音笔",
        "翻译机", "wearable", "gadget", "smart glasses", "智能眼镜",
        "smart ring", "智能戒指", "hardware", "chip", "芯片",
    ],
    "software": [
        "软件", "app", "software", "platform", "SaaS", "工具",
        "应用", "API", "cloud", "service", "toolkit",
    ],
    "llm": [
        "LLM", "大模型", "GPT", "language model", "AI model",
        "foundation model", "大语言模型", "transformer", "Claude",
        "Gemini", "通义", "文心", "ChatGPT", "Llama",
    ],
    "industry": [
        "融资", "收购", "市场", "行业", "market", "funding",
        "acquisition", "IPO", "revenue", "shipment", "sales",
        "market share", "出货量", "营收",
    ],
}


BRAND_CATEGORY_HINTS = {
    "hardware": ["科大讯飞", "iflytek", "时空壶", "timekettle", "plaud", "南卡", "nank",
                 "漫步者", "edifier", "cleer", "soundcore", "声阔", "兰士顿", "纽曼",
                 "墨觉", "颂拓", "suunto"],
    "llm": ["openai", "anthropic", "claude", "gemini", "通义", "文心", "llama", "mistral"],
    "industry": ["华为", "huawei", "小米", "xiaomi", "oppo", "vivo", "apple", "苹果",
                 "samsung", "三星", "google", "谷歌", "honor", "荣耀"],
}


def classify_content(title: str, content: str = "") -> str | None:
    text = (title + " " + content).lower()
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw.lower() in text)
        if score > 0:
            scores[category] = score

    for category, brands in BRAND_CATEGORY_HINTS.items():
        for brand in brands:
            if brand.lower() in text:
                scores[category] = scores.get(category, 0) + 0.5

    if not scores:
        return None
    return max(scores, key=scores.get)
