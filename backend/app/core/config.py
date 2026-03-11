from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Agentic AI Learning Platform"
    
    # Standard local PostgreSQL connection string
    # Format: postgresql://user:password@server/db
    # You will need to change this once you install postgres!
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/courseforge"
    
    # JWT Settings
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # Gemini AI
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
