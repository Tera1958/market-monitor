from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./market_monitor.db"
    app_name: str = "UX Research Workbench"
    debug: bool = True
    anthropic_api_key: str = ""
    anthropic_base_url: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    class Config:
        env_file = ".env"


settings = Settings()
