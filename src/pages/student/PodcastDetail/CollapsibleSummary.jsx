import React, { useState } from "react";
import { Typography } from "antd";

const { Paragraph, Link } = Typography;

const CollapsibleSummary = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div style={{ marginTop: 8 }}>
      <Paragraph
        ellipsis={
          !expanded
            ? {
                rows: 5,
                expandable: false,
              }
            : false
        }
        style={{
          whiteSpace: "normal",
          lineHeight: "1.5",
          color: "#444",
          fontSize: 15,
          fontStyle: "italic",
          textAlign: "justify",
          textIndent: "2em",
        }}
      >
        {text || "Không có tóm tắt"}
      </Paragraph>

      {text && text.length > 200 && (
        <Link
          onClick={toggleExpanded}
          style={{
            fontWeight: 500,
            color: "#1677ff",
            userSelect: "none",
          }}
        >
          {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
        </Link>
      )}
    </div>
  );
};

export default CollapsibleSummary;
