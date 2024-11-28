import React, { useState } from "react";

function Page7() {
  const [data, setData] = useState("");

  const handleFetchAllAttendance = async () => {
    // GET: Endpoint to fetch all attendance
    const response = await fetch("http://127.0.0.1:5000/attendance");
    const result = await response.json();
    setData(JSON.stringify(result));
  };

  return (
    <div>
      <h1>Fetch All Attendance</h1>
      <button onClick={handleFetchAllAttendance}>Fetch</button>
      <p>{data}</p>
    </div>
  );
}

export default Page7;

