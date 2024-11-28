import React, { useState } from "react";

function Page5() {
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");

  const handleDeleteStudent = async () => {
    // DELETE: Endpoint to delete student
    const response = await fetch(`http://127.0.0.1:5000/students/${rollNo}`, {
      method: "DELETE",
    });
    const result = await response.json();
    setMessage(result.message || result.error);
  };

  return (
    <div>
      <h1>Delete Student</h1>
      <input
        type="text"
        placeholder="Roll No"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      />
      <button onClick={handleDeleteStudent}>Delete</button>
      <p>{message}</p>
    </div>
  );
}

export default Page5;
