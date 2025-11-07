import React, { useEffect, useState } from "react";
import Table from "./table";
import Navbar from "./navbar";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard/all")
      .then((res) => res.json())
      .then((tables) => setData(tables))
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>📊 Full Database View</h2>

      {Object.entries(data).map(([tableName, rows]) => (
        <div key={tableName} style={{ marginBottom: "40px" }}>
          <h3>{tableName}</h3>
          {rows.length > 0 ? (
            <Table columns={Object.keys(rows[0])} data={rows} />
          ) : (
            <p>No records yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
