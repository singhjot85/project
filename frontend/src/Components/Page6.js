import React, { useState } from "react";

function Page6() {
  const [rollNo, setRollNo] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendMessageStatus, setSendMessageStatus] = useState("");

  const handleFetchAttendance = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/attendance/${rollNo}`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      const result = await response.json();
      setAttendanceData(result);
      setSendMessageStatus(""); // Reset message status
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData(null);
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      setIsSending(true);
      setSendMessageStatus("");
      const response = await fetch(
        `http://127.0.0.1:5000/sendAttendance/${rollNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send WhatsApp message");
      }

      const result = await response.json();
      setSendMessageStatus(result.message || "Message sent successfully!");
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      setSendMessageStatus("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h1>Fetch Attendance</h1>
      <input
        type="text"
        placeholder="Roll No"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      />
      <button onClick={handleFetchAttendance}>Fetch</button>

      {attendanceData && attendanceData.Attendance ? (
        <div>
          <h3>Attendance for {attendanceData.Roll_No}</h3>
          <table
            border="1"
            style={{
              marginTop: "20px",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attendanceData.Attendance).map(
                ([date, status]) => {
                  if (date && status !== null) {
                    return (
                      <tr key={date}>
                        <td>{date}</td>
                        <td>{status}</td>
                      </tr>
                    );
                  }
                  return null;
                }
              )}
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleSendWhatsApp}
              disabled={isSending}
              style={{
                padding: "10px 20px",
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                cursor: isSending ? "not-allowed" : "pointer",
              }}
            >
              {isSending ? "Sending..." : "Send WhatsApp"}
            </button>
            {sendMessageStatus && (
              <p
                style={{
                  marginTop: "10px",
                  color: sendMessageStatus.includes("Failed")
                    ? "red"
                    : "green",
                }}
              >
                {sendMessageStatus}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p>No attendance data available</p>
      )}
    </div>
  );
}

export default Page6;
