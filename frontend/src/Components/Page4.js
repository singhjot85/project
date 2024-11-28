import React, { useState } from "react";

function Page4() {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddStudent = async () => {
    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("roll_no", rollNo);
    formData.append("name", name);
    formData.append("mobile_no", mobile);
    formData.append("image", image);

    try {
      // POST: Endpoint to add student
      const response = await fetch("http://127.0.0.1:5000/students", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || result.error);
    } catch (error) {
      setMessage("Error occurred while adding student.");
    }
  };

  return (
    <div>
      <h1>Add Student</h1>
      <input
        type="text"
        placeholder="Roll No"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handleAddStudent}>Add</button>
      <p>{message}</p>
    </div>
  );
}

export default Page4;
