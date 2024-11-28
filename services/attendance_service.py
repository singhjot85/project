from database import get_connection
from utils.log_utils import log_message
from datetime import datetime

def mark_attendance(roll_no, log_file_name):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        date_str = datetime.now().strftime("%Y_%m_%d")  # Transform date to valid column name (e.g., '2024_11_27')

        # Check if the column for the current date exists
        cursor.execute("PRAGMA table_info(attendance);")
        columns = [column[1] for column in cursor.fetchall()]  # Fetch all column names

        if date_str not in columns:
            # Add column for today's date with default value 'Absent'
            cursor.execute(f"ALTER TABLE attendance ADD COLUMN \"{date_str}\" TEXT DEFAULT 'Absent';")
            conn.commit()

        # Check if the roll_no exists and the attendance for today
        cursor.execute(f"SELECT \"{date_str}\" FROM attendance WHERE roll_no = ?", (roll_no,))
        row = cursor.fetchone()

        if row is None:
            # If roll_no does not exist, add a new row with roll_no and mark 'Present'
            cursor.execute(f"INSERT INTO attendance (roll_no, \"{date_str}\") VALUES (?, ?);", (roll_no, 'Present'))
        elif row[0] == "Absent":
            # If roll_no exists but is marked 'Absent', update to 'Present'
            cursor.execute(f"UPDATE attendance SET \"{date_str}\" = 'Present' WHERE roll_no = ?;", (roll_no,))
        else:
            return {"error": f"Attendance already marked for Roll No {roll_no} on {date_str}"}, 400

        conn.commit()
        message = f"Attendance marked for Roll No {roll_no} on {date_str}."
        log_message(message, log_file_name)
        return {"message": message}
    finally:
        conn.close()

def fetch_attendance_all():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM attendance')
    records = cursor.fetchall()
    conn.close()

    return {"records": records}

def fetch_attendance(roll_no):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM attendance WHERE roll_no = ?', (roll_no,))
    records = cursor.fetchall()
    conn.close()

    return {"records": records}
