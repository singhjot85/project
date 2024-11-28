import React, { useState } from "react";

function Page6() {
  const [rollNo, setRollNo] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);

  const handleFetchAttendance = async () => {
    // Fetch attendance data for the given roll number
    const response = await fetch(`http://127.0.0.1:5000/attendance/${rollNo}`);
    const result = await response.json();
    setAttendanceData(result); // Set the result to state
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
          <table border="1" style={{ marginTop: "20px", borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attendanceData.Attendance).map(([date, status]) => {
                // Skip null values for date and status
                if (date && status !== null) {
                  return (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{status}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No attendance data available</p>
      )}
    </div>
  );
}

export default Page6;
