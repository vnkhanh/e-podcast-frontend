import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DocumentDetail() {
  const { id } = useParams(); // Lấy documentID từ URL /documents/:id
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const chunkIndex = parseInt(query.get("chunk"), 10);

  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8080/api/user/documents/${id}`)
      .then((res) => {
        const data = res.data;
        if (data.extracted_text) {
          // Chia nội dung thành đoạn nhỏ theo 2 dòng trống
          const parts = data.extracted_text
            .replace(/\r\n/g, "\n") // chuẩn hóa newline
            .split(/\n+/)           // chia theo 1 hoặc nhiều dòng trống
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
            console.log("Số đoạn:", parts.length, parts);
          setChunks(parts);
        } else {
          setChunks([]);
        }
      })
      .catch((err) => console.error("Không tải được tài liệu:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Cuộn đến đoạn tương ứng khi có chunkIndex
  useEffect(() => {
    if (chunkIndex && chunks.length > 0) {
      const el = document.getElementById(`chunk-${chunkIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.backgroundColor = "#fff3cd";
        setTimeout(() => (el.style.backgroundColor = "transparent"), 2000);
      }
    }
  }, [chunkIndex, chunks]);

  if (loading) return <p style={{ padding: 16 }}>Đang tải tài liệu...</p>;

  if (!chunks.length)
    return <p style={{ padding: 16 }}>Không có nội dung để hiển thị.</p>;

  return (
    <div style={{ padding: "16px", lineHeight: "1.6" }}>
      {chunks.map((chunk, i) => (
        <p
          key={i}
          id={`chunk-${i + 1}`}
          style={{
            backgroundColor: chunkIndex === i + 1 ? "#fff3cd" : "transparent",
            padding: "8px",
            borderRadius: "6px",
            transition: "background-color 0.3s",
          }}
        >
          {chunk}
        </p>
      ))}
    </div>
  );
}

export default DocumentDetail;
