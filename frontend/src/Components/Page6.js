import React, { useState } from "react";

function Page6() {
  const [rollNo, setRollNo] = useState("");
  const [data, setData] = useState("");

  const handleFetchAttendance = async () => {
    // GET: Endpoint to fetch attendance
    const response = await fetch(`http://127.0.0.1:5000/attendance/${rollNo}`);
    const result = await response.json();
    setData(JSON.stringify(result));
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
      <p>{data}</p>
    </div>
  );
}

export default Page6;
