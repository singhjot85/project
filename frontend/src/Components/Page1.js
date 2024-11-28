import React from "react";
import { useNavigate } from "react-router-dom";

function Page1() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Select User Type</h1>
      <button disabled>Student (Feature Unavailable)</button>
      <button onClick={() => navigate("/teacher")}>Teacher</button>
    </div>
  );
}

export default Page1;
