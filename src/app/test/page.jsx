"use client";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`)
      .then(res => res.json())
      .then(data => setData(data.message))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Test API</h1>
      <p>{data || "Đang tải dữ liệu..."}</p>
    </main>
  );
}
