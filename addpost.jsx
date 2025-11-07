import React, { useState } from "react";
import FormInput from "./forminput";
import Button from "./button";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [locDescription, setLocDescription] = useState("");
  const [statusId, setStatusId] = useState("1"); // default: lost

  const handleSubmit = async () => {
    const data = {
      student_id: studentId,
      item_name: itemName,
      item_category: itemCategory,
      item_description: itemDescription,
      building_name: buildingName,
      area_name: areaName,
      loc_description: locDescription,
      status_id: statusId,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Post added successfully!");
        navigate("/"); // go back to Posts page
      } else {
        alert("❌ Error adding post!");
      }
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <div style={{ marginTop: "20px", maxWidth: "500px", marginInline: "auto" }}>
        <Button
          label="🏠 Back to Home"
          onClick={() => (window.location.href = "./posts")}
          style={{
            backgroundColor: "#555",
            marginBottom: "15px",
          }}
        />

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add New Post</h2>

        <FormInput label="Student ID" value={studentId} onChange={setStudentId} />
        <FormInput label="Item Name" value={itemName} onChange={setItemName} />
        <FormInput label="Item Category" value={itemCategory} onChange={setItemCategory} />
        <FormInput label="Item Description" value={itemDescription} onChange={setItemDescription} />
        <FormInput label="Building Name" value={buildingName} onChange={setBuildingName} />
        <FormInput label="Area Name" value={areaName} onChange={setAreaName} />
        <FormInput label="Location Description" value={locDescription} onChange={setLocDescription} />

        <div style={{ margin: "10px 0" }}>
          <label>Status:</label>
          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            style={{ marginLeft: "10px", padding: "8px", borderRadius: "5px" }}
          >
            <option value="1">Lost</option>
            <option value="2">Found</option>
          </select>
        </div>

        <Button
          label="Submit Post"
          onClick={handleSubmit}
          style={{ width: "100%", backgroundColor: "#3265ddff", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}
