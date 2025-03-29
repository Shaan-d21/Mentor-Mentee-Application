from database import engine
import os
from sqlalchemy import text

def run_migration():
    # Read the SQL file
    migration_path = os.path.join(os.path.dirname(__file__), 'migrations', 'add_profile_completed.sql')
    with open(migration_path, 'r') as f:
        sql = f.read()
    
    # Execute the migration
    with engine.connect() as connection:
        connection.execute(text(sql))
        connection.commit()

if __name__ == "__main__":
    run_migration()
    print("Migration completed successfully!") 