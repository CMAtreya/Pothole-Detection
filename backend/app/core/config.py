from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Pothole Detection API"
    app_version: str = "0.1.0"
    api_prefix: str = "/api/v1"
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
