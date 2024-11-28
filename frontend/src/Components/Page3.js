import React, { useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons for success and error

function Page3() {
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Track processing state
  const [attendanceStatus, setAttendanceStatus] = useState(null); // Track attendance status (success or error)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Static Attendance Handler
  const handleStaticAttendance = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/attendance/mark/${rollNo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setMessage(result.message || result.error || "Error marking attendance.");
    } catch (error) {
      console.error("Error during static attendance:", error);
      setMessage("Failed to communicate with the server.");
    }
  };

  // Launch Camera
  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setMessage("Unable to access camera.");
      setCameraActive(false);
    }
  };

  // Capture Image and Send to Live Attendance Endpoint
  const handleLiveAttendance = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to imageBlob
      const imageBlob = await new Promise((resolve) =>
        canvas.toBlob(
          resolve,
          "image/jpeg"
        )
      );

      if (!imageBlob) {
        setMessage("Error capturing image. Please try again.");
        return;
      }

      const formData = new FormData();
      formData.append("file", imageBlob, "image.jpg");

      // Disable the button and set processing state
      setIsProcessing(true);
      setAttendanceStatus(null); // Reset status before new request

      try {
        const response = await fetch("http://127.0.0.1:5000/attendance/mark/live", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setMessage(result.message || "Attendance marked successfully.");
          setAttendanceStatus("success"); // Set success status
        } else {
          const errorResult = await response.json();
          console.error("Error response:", errorResult);
          setMessage(errorResult.error || "Failed to mark attendance.");
          setAttendanceStatus("error"); // Set error status
        }
      } catch (error) {
        console.error("Error during live attendance:", error);
        setMessage("Failed to communicate with the server.");
        setAttendanceStatus("error"); // Set error status
      } finally {
        // Re-enable the button after response
        setIsProcessing(false);
        stopCamera();
      }
    } else {
      setMessage("Camera is not active. Please start the camera.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  return (
    <div>
      <h1>Mark Attendance</h1>

      {/* Static Attendance */}
      <div>
        <h2>Static Attendance</h2>
        <input
          type="text"
          placeholder="Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
        <button onClick={handleStaticAttendance}>Mark Attendance</button>
      </div>

      {/* Live Attendance */}
      <div>
        <h2>Live Attendance</h2>
        {!cameraActive && <button onClick={startCamera}>Launch Camera</button>}
        {cameraActive && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              style={{ width: "300px", height: "200px", border: "1px solid black" }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
              width="300"
              height="200"
            ></canvas>
            <button onClick={handleLiveAttendance} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Capture and Mark Attendance"}
            </button>
            <button onClick={stopCamera}>Stop Camera</button>
          </div>
        )}
      </div>

      {/* Message Display */}
      <p>{message}</p>

      {/* Display Attendance Status */}
      {attendanceStatus === "success" && (
        <div style={{ color: "green" }}>
          <FaCheckCircle /> Attendance marked successfully!
        </div>
      )}
      {attendanceStatus === "error" && (
        <div style={{ color: "red" }}>
          <FaTimesCircle /> Failed to mark attendance.
        </div>
      )}
    </div>
  );
}

export default Page3;
