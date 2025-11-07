import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./forminput";
import Button from "./button";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({
    student_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    section: "",
    course: "",
    DOB: "",
    phone_number: "",
    alternate_phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/students", form);

      if (res.data.message) {
        setMessage("✅ Signup successful!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("⚠️ Error creating student. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Student Registration</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        <FormInput
          label="Student ID"
          value={form.student_id}
          onChange={(v) => handleChange("student_id", v)}
          placeholder="Enter your SRN"
        />

        <FormInput
          label="First Name"
          value={form.first_name}
          onChange={(v) => handleChange("first_name", v)}
          placeholder="Enter first name"
        />

        <FormInput
          label="Middle Name"
          value={form.middle_name}
          onChange={(v) => handleChange("middle_name", v)}
          placeholder="Enter middle name (optional)"
        />

        <FormInput
          label="Last Name"
          value={form.last_name}
          onChange={(v) => handleChange("last_name", v)}
          placeholder="Enter last name"
        />

        <FormInput
          label="Section"
          value={form.section}
          onChange={(v) => handleChange("section", v)}
          placeholder="E.g., A / B"
        />

        <FormInput
          label="Course"
          value={form.course}
          onChange={(v) => handleChange("course", v)}
          placeholder="E.g., AIML / CSE"
        />

        <FormInput
          label="Date of Birth"
          type="date"
          value={form.DOB}
          onChange={(v) => handleChange("DOB", v)}
        />

        <FormInput
          label="Phone Number"
          type="tel"
          value={form.phone_number}
          onChange={(v) => handleChange("phone_number", v)}
          placeholder="10-digit phone number"
        />

        <FormInput
          label="Alternate Phone"
          type="tel"
          value={form.alternate_phone}
          onChange={(v) => handleChange("alternate_phone", v)}
          placeholder="Alternate phone (optional)"
        />

        <FormInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => handleChange("password", v)}
          placeholder="Create a password"
        />

        <Button type="submit" label="Register" style={{ marginTop: "10px" }} />
      </form>

      {message && <p className="message">{message}</p>}

      <p className="login-link">
        Already have an account?{" "}
        <a href="/login" style={{ color: "#3265ddff" }}>
          Login here
        </a>
      </p>
    </div>
  );
}

export default Signup;
