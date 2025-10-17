import React, { useState } from "react";
import { Card, Button, Typography } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const { Text } = Typography;

function FlashcardReference({ currentCard }) {
  const [showRef, setShowRef] = useState(false);

  return (
    <Card
      style={{
        marginTop: 20,
        borderRadius: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Trích dẫn từ tài liệu</span>
          <Button
            type="link"
            icon={showRef ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setShowRef(!showRef)}
          >
            {showRef ? "Ẩn" : "Hiện"}
          </Button>
        </div>
      }
    >
      {showRef && (
        <Text type="secondary" style={{ whiteSpace: "pre-line" }}>
          {currentCard.reference_text ||
            currentCard.referenceText ||
            "Không có nội dung trích dẫn."}
        </Text>
      )}
    </Card>
  );
}

export default FlashcardReference;
