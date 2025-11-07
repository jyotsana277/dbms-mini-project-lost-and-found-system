import React, { useState, useEffect } from "react";
import Table from "./table.jsx";
import Navbar from "./navbar.jsx";
import Button from "./button.jsx";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  // ✅ Fetch posts from backend
  const fetchPosts = () => {
    fetch("http://127.0.0.1:5000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Define columns to display
  const columns = [
    "student_name",
    "item_name",
    "p_description",
    "building_name",
    "area_name",
    "loc_description",
    "status_name",
  ];

  return (
    <div style={{ padding: "20px 60px", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        {/* --- Header section --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>All Posts</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            {/* 👇 Button to add new post */}
            <Button
              label="➕ Add New Post"
              onClick={() => (window.location.href = "./addpost")}
              style={{ backgroundColor: "#3265ddff" }}
            />

            {/* 👇 Button to go to match requests page */}
            <Button
              label="💬 Match Requests"
              onClick={() => (window.location.href = "./matchrequests")}
              style={{ backgroundColor: "#3265ddff" }}
            />
          </div>
        </div>

        {/* --- Posts Table --- */}
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          {posts.length > 0 ? (
            <Table columns={columns} data={posts} />
          ) : (
            <p style={{ textAlign: "center", marginTop: "40px" }}>
              No posts available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
