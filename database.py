import sqlite3

DB_FILE = "attendance.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            roll_no TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            mobile_no TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            roll_no TEXT,
            date TEXT,
            status TEXT,
            FOREIGN KEY (roll_no) REFERENCES students (roll_no)
        )
    ''')

    conn.commit()
    conn.close()

def get_connection():
    return sqlite3.connect(DB_FILE)
