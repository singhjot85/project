import React from "react";
import { useNavigate } from "react-router-dom";

function Page2() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Teacher Page</h1>
      <button onClick={() => navigate("/mark-attendance")}>Mark Attendance</button>
      <button onClick={() => navigate("/add-student")}>Add Student</button>
      <button onClick={() => navigate("/delete-student")}>Delete Student</button>
      <button onClick={() => navigate("/fetch-attendance")}>Fetch Attendance One</button>
      <button onClick={() => navigate("/fetch-attendance-all")}>Fetch Attendance All</button>
    </div>
  );
}

export default Page2;
