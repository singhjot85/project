import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page1 from "./Components/Page1";
import Page2 from "./Components/Page2";
import Page3 from "./Components/Page3";
import Page4 from "./Components/Page4";
import Page5 from "./Components/Page5";
import Page6 from "./Components/Page6";
import Page7 from "./Components/Page7";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/teacher" element={<Page2 />} />
        <Route path="/mark-attendance" element={<Page3 />} />
        <Route path="/add-student" element={<Page4 />} />
        <Route path="/delete-student" element={<Page5 />} />
        <Route path="/fetch-attendance" element={<Page6 />} />
        <Route path="/fetch-attendance-all" element={<Page7 />} />
      </Routes>
    </Router>
  );
}

export default App;
