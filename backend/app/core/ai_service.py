"""
Unified AI Service Layer.

Abstracts LLM calls for all modules. Currently a stub —
implementations will be added as modules require AI capabilities
(transcript cleaning, survey generation, theme extraction, etc.)
"""

from abc import ABC, abstractmethod


class BaseAIService(ABC):
    @abstractmethod
    def summarize(self, text: str, max_length: int = 200) -> str:
        pass

    @abstractmethod
    def classify(self, text: str, categories: list[str]) -> str:
        pass

    @abstractmethod
    def extract_themes(self, texts: list[str]) -> list[dict]:
        pass


class AIService(BaseAIService):
    """Placeholder implementation. Will integrate with Claude API."""

    def summarize(self, text: str, max_length: int = 200) -> str:
        raise NotImplementedError("AI service not yet configured")

    def classify(self, text: str, categories: list[str]) -> str:
        raise NotImplementedError("AI service not yet configured")

    def extract_themes(self, texts: list[str]) -> list[dict]:
        raise NotImplementedError("AI service not yet configured")
