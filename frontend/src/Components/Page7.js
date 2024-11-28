import React, { useState } from "react";

function Page7() {
  const [attendanceData, setAttendanceData] = useState([]);

  const handleFetchAllAttendance = async () => {
    try {
      // Fetch all attendance data
      const response = await fetch("http://127.0.0.1:5000/attendance");
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      const result = await response.json();
      setAttendanceData(result.records); // Assuming result.records contains the array of attendance data
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]);
    }
  };

  return (
    <div>
      <h1>Fetch All Attendance</h1>
      <button onClick={handleFetchAllAttendance}>Fetch</button>

      {attendanceData.length > 0 ? (
        <table border="1" style={{ marginTop: "20px", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Roll No</th>
              {attendanceData.length > 0 &&
                Object.keys(attendanceData[0].Attendance).map((key) => (
                  <th key={key}>{key}</th> // Display dates as column headers
                ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record["Roll No"]}</td> {/* Display Roll No */}
                {Object.entries(record.Attendance).map(([date, status], i) => (
                  <td key={i}>{status}</td> // Display attendance status for each date
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance data available</p>
      )}
    </div>
  );
}

export default Page7;