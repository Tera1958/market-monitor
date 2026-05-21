from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./market_monitor.db"
    app_name: str = "Market Monitor"
    debug: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
