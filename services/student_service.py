from database import get_connection

def add_student(roll_no, name, mobile_no):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('INSERT INTO students (roll_no, name, mobile_no) VALUES (?, ?, ?)', (roll_no, name, mobile_no))
        conn.commit()
        return {"message": f"Student {name} added successfully"}
    except Exception as e:
        return {"error": str(e)}, 400
    finally:
        conn.close()

def delete_student(roll_no):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('DELETE FROM attendance WHERE roll_no = ?', (roll_no,))
        cursor.execute('DELETE FROM students WHERE roll_no = ?', (roll_no,))
        conn.commit()
        return {"message": f"Student with Roll No {roll_no} deleted successfully"}
    except Exception as e:
        return {"error": str(e)}, 400
    finally:
        conn.close()

def fetch_student(roll_no):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM students WHERE roll_no = ?', (roll_no,))
    student = cursor.fetchone()
    conn.close()
    return student

def save_image(file, roll_no):
    import os
    allowed_extensions = {"png", "jpg", "jpeg"}
    extension = file.filename.rsplit(".", 1)[-1].lower()
    if extension not in allowed_extensions:
        raise ValueError("Invalid file format. Only PNG, JPG, and JPEG are allowed.")

    # Create the path to save the file
    save_path = os.path.join("static/saved_faces", f"{roll_no}.{extension}")
    file.save(save_path)