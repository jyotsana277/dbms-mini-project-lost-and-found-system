import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./navbar";
import Table from "./table";

export default function Profile() {
  const [studentId, setStudentId] = useState("");
  const [summary, setSummary] = useState({ total_posts: 0, match_requests_received: 0 });
  const [myPosts, setMyPosts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  // ✅ Load student_id from localStorage (set during login)
  useEffect(() => {
  const loggedUser = JSON.parse(localStorage.getItem("student"));
  console.log("Logged User:", loggedUser); // <-- Add this line
  if (loggedUser && loggedUser.student_id) {
    setStudentId(loggedUser.student_id);
  } else {
    alert("Please log in first.");
    window.location.href = "/login";
  }
}, []);


  // ✅ Fetch student summary
  const fetchSummary = useCallback(() => {
    if (!studentId) return;
    fetch(`http://127.0.0.1:5000/student/${studentId}/summary`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Error fetching summary:", err));
  }, [studentId]);

  // ✅ Fetch student's posts
  const fetchMyPosts = useCallback(() => {
    if (!studentId) return;
    fetch(`http://127.0.0.1:5000/student/${studentId}/posts`)
      .then((res) => res.json())
      .then((data) => setMyPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, [studentId]);

  // ✅ Fetch match requests for this student's posts
  const fetchMyRequests = useCallback(() => {
    if (!studentId) return;
    fetch(`http://127.0.0.1:5000/matchrequests/${studentId}`)
      .then((res) => res.json())
      .then((data) => setMyRequests(data))
      .catch((err) => console.error("Error fetching match requests:", err));
  }, [studentId]);

  // ✅ Delete a post
  const handleDeletePost = (post) => {
    if (!window.confirm(`Are you sure you want to delete post "${post.item_name}"?`)) return;
    fetch(`http://127.0.0.1:5000/posts/${post.post_id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        alert("Post deleted!");
        fetchMyPosts();
      })
      .catch((err) => console.error("Error deleting post:", err));
  };

  // ✅ Approve a match request
  const handleApprove = (request) => {
    if (!window.confirm(`Approve request from ${request.requester_name}?`)) return;
    fetch(`http://127.0.0.1:5000/requests/${request.request_id}/approve`, { method: "PUT" })
      .then((res) => res.json())
      .then(() => {
        alert("Request approved! Post marked as returned.");
        fetchMyRequests();
        fetchMyPosts();
        fetchSummary();
      })
      .catch((err) => console.error("Error approving request:", err));
  };

  // ✅ Fetch all data when studentId is available
  useEffect(() => {
    if (studentId) {
      fetchSummary();
      fetchMyPosts();
      fetchMyRequests();
    }
  }, [studentId, fetchSummary, fetchMyPosts, fetchMyRequests]);

  return (
    <div style={{ padding: "20px 60px", fontFamily: "Arial, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>My Profile</h1>
        <h3 style={{ textAlign: "center", color: "#555" }}>
          Student ID: {studentId}
        </h3>

        {/* Summary Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            margin: "30px 0",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "20px",
              borderRadius: "10px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Posts</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>{summary.total_posts}</p>
          </div>

          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "20px",
              borderRadius: "10px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Match Requests Received</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {summary.match_requests_received}
            </p>
          </div>
        </div>

        {/* My Posts Table */}
        <h2>My Posts</h2>
        {myPosts.length > 0 ? (
          <Table
            columns={[
              "item_name",
              "item_description",
              "building_name",
              "area_name",
              "status_name",
              "date_posted",
            ]}
            data={myPosts}
            actions={[
              {
                label: "Delete",
                onClick: handleDeletePost,
              },
            ]}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>No posts yet.</p>
        )}

        {/* My Match Requests */}
        <h2 style={{ marginTop: "40px" }}>Match Requests for My Posts</h2>
        {myRequests.length > 0 ? (
          <Table
            columns={[
              "item_name",
              "requester_name",
              "message",
              "request_date",
            ]}
            data={myRequests}
            actions={[
              {
                label: "Approve",
                onClick: handleApprove,
              },
            ]}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>No match requests received yet.</p>
        )}
      </div>
    </div>
  );
}
