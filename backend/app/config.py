from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./market_monitor.db"
    app_name: str = "UX Research Workbench"
    debug: bool = True
    anthropic_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
