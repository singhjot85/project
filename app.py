from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db
from services.student_service import add_student, delete_student, fetch_student, save_image
from services.face_service import detect_faces
from services.attendance_service import mark_attendance, fetch_attendance_all, fetch_attendance
import os
from utils.log_utils import create_log_file

app = Flask(__name__)
CORS(app)

log_file_name = create_log_file()
saved_faces= r'static\saved_faces'
init_db()

def complete_mobile_number(mobile_number):
    return mobile_number if mobile_number.startswith('+') else '+91' + mobile_number

@app.route("/students", methods=["POST"])
def api_add_student():
    data = request.form 
    file = request.files.get("image")

    if not all(key in data for key in ("roll_no", "name", "mobile_no")):
        return jsonify({"error": "Missing required fields"}), 400

    if not file or file.filename == "":
        return jsonify({"error": "Image is required"}), 400

    roll_no = data["roll_no"]
    name = data["name"]
    mobile_no = data["mobile_no"]
    mobile_no= complete_mobile_number(mobile_no)

    # Save the image file
    try:
        save_image(file, roll_no)
    except Exception as e:
        return jsonify({"error": f"Failed to save image: {str(e)}"}), 500

    # Add the student record
    response = add_student(roll_no, name, mobile_no)
    return jsonify(response)

@app.route("/attendance/mark/<roll_no>", methods=["POST"])
def api_mark_attendance(roll_no):
    from services.attendance_service import mark_attendance
    response= mark_attendance(roll_no, log_file_name)

    return jsonify(response)

@app.route("/attendance/<roll_no>", methods=["GET"])
def api_fetch_attendance(roll_no):
    response = fetch_attendance(roll_no)
    return jsonify(response)

@app.route("/attendance", methods=["GET"])
def api_fetch_attendance_all():
    response = fetch_attendance_all()
    return jsonify(response)

@app.route("/students/<roll_no>", methods=["DELETE"])
def api_delete_student(roll_no):
    response = delete_student(roll_no)
    return jsonify(response)

@app.route('/sendAttendance/<rollno>', methods=['POST'])
def send_attendance_message(rollno):
    try:
        attendance_data = fetch_attendance(rollno)
        if not attendance_data:
            return jsonify({"message": "No attendance data found"}), 404
        
        import services.sending_services as ss
        ss.send_whatsapp_message(rollno, attendance_data)
        return jsonify({"message": "WhatsApp message sent successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/attendance/mark/live", methods=["POST"])
def api_mark_attendance_live():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        from werkzeug.utils import secure_filename
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # roll_no = detect_faces(saved_faces,log_file_name,file_path)
        roll_no = detect_faces(saved_faces,log_file_name)

        if roll_no is None:
            return jsonify({"error": "Student not recognized."}), 404

        # Mark attendance
        response = mark_attendance(roll_no, log_file_name)
        return jsonify(response)

    return jsonify({"error": "Invalid file type. Only images are allowed."}), 400

if __name__ == "__main__":
    app.run(debug=True)
