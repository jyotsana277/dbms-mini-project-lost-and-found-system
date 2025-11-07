import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import FormInput from "./forminput";
import Button from "./button";
import Table from "./table";

export default function MatchRequests() {
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    student_id: "",
    post_id: "",
    message: ""
  });

  // fetch posts for dropdown
  useEffect(() => {
    fetch("http://127.0.0.1:5000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error loading posts:", err));
  }, []);

  // fetch match requests
  const fetchRequests = () => {
    fetch("http://127.0.0.1:5000/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching requests:", err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = () => {
    if (!form.student_id || !form.post_id || !form.message) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://127.0.0.1:5000/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Request submitted!");
        setForm({ student_id: "", post_id: "", message: "" });
        fetchRequests();
      })
      .catch((err) => console.error("Error submitting request:", err));
  };

  const columns = [
    "request_id",
    "post_description",
    "requester_name",
    "message",
    "request_date"
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h2>📮 Make Match Request</h2>

      <FormInput
        label="Your Student ID"
        value={form.student_id}
        onUpdate={(val) => setForm({ ...form, student_id: val })}
        placeholder="Enter your SRN"
      />

      <div style={{ marginBottom: "10px" }}>
        <label>Choose Post:</label>
        <select
          value={form.post_id}
          onChange={(e) => setForm({ ...form, post_id: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: "5px"
          }}
        >
          <option value="">Select a Post</option>
          {posts.map((p) => (
            <option key={p.post_id} value={p.post_id}>
              {p.student_name} — {p.item_name} ({p.building_name})
            </option>
          ))}
        </select>
      </div>

      <FormInput
        label="Message"
        value={form.message}
        onUpdate={(val) => setForm({ ...form, message: val })}
        placeholder="Enter your message"
      />

      <Button label="Send Request" onClick={handleSubmit} />

      <h2 style={{ marginTop: "30px" }}>📋 All Match Requests</h2>
      <Table columns={columns} data={requests} />
    </div>
  );
}
