from sqlalchemy import text
from app.core.database import engine

def repair():
    with engine.begin() as conn:
        try:
            conn.execute(text('ALTER TABLE courses ADD COLUMN description TEXT;'))
            print("Successfully added 'description' column to 'courses' table.")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("Column 'description' already exists.")
            else:
                print(f"Error: {e}")

if __name__ == "__main__":
    repair()
