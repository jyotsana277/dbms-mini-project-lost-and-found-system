import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; 
import Signup from "./signup";
import Posts from "./posts"
import Dashboard from "./dashboard.jsx"
import MatchRequests from "./matchrequests";
import AddPost from "./addpost.jsx"; 
import Profile from "./profile.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ add this */}
        <Route path="/posts" element={<Posts />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/match" element={<MatchRequests />} />  {/* ✅ Add this */}
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

