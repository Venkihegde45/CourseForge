from sqlalchemy import text
from app.core.database import engine, Base
from app.models import models

def clean_and_init_db():
    with engine.begin() as connection:
        # Get all table names
        result = connection.execute(text("""
            SELECT tablename FROM pg_catalog.pg_tables 
            WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
        """))
        tables = [row[0] for row in result]
        
        if tables:
            print(f"Dropping tables: {', '.join(tables)}")
            # Drop all tables with Cascade
            connection.execute(text(f"DROP TABLE IF EXISTS {', '.join(tables)} CASCADE"))
            print("Legacy tables dropped successfully.")
        else:
            print("No tables found to drop.")

    print("Creating new tables...")
    Base.metadata.create_all(bind=engine)
    print("Database initialization complete.")

if __name__ == "__main__":
    clean_and_init_db()
