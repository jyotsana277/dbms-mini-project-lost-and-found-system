import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./forminput";
import Button from "./button";
import "./Login.css";

function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        student_id: studentId,
        password: password,
      });

      console.log("Login response:", res.data);

      if (res.data.success && res.data.user) {
        // Convert array to object with keys
        const userArray = res.data.user;
        const userObj = {
          student_id: userArray[0],
          first_name: userArray[1],
          middle_name: userArray[2],
          last_name: userArray[3],
          section: userArray[4],
          course: userArray[5],
          DOB: userArray[6],
          password: userArray[7],
          phone_number: userArray[8],
          alternate_phone: userArray[9],
        };

        console.log("Saving to localStorage:", userObj);
        localStorage.setItem("student", JSON.stringify(userObj));

        setMessage("✅ Login successful!");
        navigate("/posts"); // redirect to posts page
      } else {
        setMessage("❌ Wrong ID or Password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("⚠️ Server error, try again later");
    }
  };

  return (
    <div className="login-container">
      <h2>Lost & Found Portal</h2>
      <form onSubmit={handleLogin} className="login-form">
        <FormInput
          label="Student ID"
          value={studentId}
          onChange={setStudentId}
          placeholder="Enter your SRN"
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
        />

        <Button type="submit" label="Login" />
      </form>

      {message && <p className="message">{message}</p>}

      <p className="signup-link">
        Don’t have an account?{" "}
        <a href="/signup" style={{ color: "#3265ddff" }}>
          Sign up here
        </a>
      </p>
    </div>
  );
}

export default Login;
