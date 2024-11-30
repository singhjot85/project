# from twilio.rest import Client
import pywhatkit as kit
# import static.credentials as crds
from database import get_connection

# TWILIO_ACCOUNT_SID = crds.SID
# TWILIO_AUTH_TOKEN = crds.AUTH_TOKEN
# TWILIO_WHATSAPP_NUMBER = crds.T_NO

# def send_whatsapp_message_tw(rollno, attendance_data):
#     try:
#         client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

#         message_body = f"Attendance for Roll No: {rollno}\n"
#         for date, status in attendance_data["Attendance"].items():
#             message_body += f"{date}: {status}\n"

#         recipient_number = "whatsapp:+911234567890" 

#         message = client.messages.create(body=message_body,from_=TWILIO_WHATSAPP_NUMBER,to=recipient_number)

#         print(f"WhatsApp message sent successfully! SID: {message.sid}")
#     except Exception as e:
#         print(f"Error sending WhatsApp message: {e}")

def complete_mobile_number(mobile_number):
    return mobile_number if mobile_number.startswith('+') else '+91' + mobile_number

def send_whatsapp_message(rollno, attendance_data):
    try:
        message = f"Attendance for Roll No: {rollno}\n"
        for date, status in attendance_data["Attendance"].items():
            message += f"{date}: {status}\n"

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT mobile_no FROM students WHERE roll_no = ?', (rollno,))
        result = cursor.fetchone()
        conn.close()

        if not result:
            raise ValueError(f"No phone number found for Roll No: {rollno}")
        phone_number = complete_mobile_number(result[0])
        print(phone_number)

        # kit.sendwhatmsg_instantly(phone_no=phone_number, message=message, tab_close=True)
        kit.sendwhatmsg_instantly(phone_no=phone_number, message=message)
        print("WhatsApp message sent successfully!")
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")
