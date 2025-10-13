import React, { useState } from "react";
import { Card, Button, Divider, Typography, Space } from "antd";
import FlashcardReference from "./FlashcardReference";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const { Text } = Typography;

const FlashcardStudySection = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const total = flashcards.length;
  const currentCard = flashcards[currentIndex];

  const handleFlip = () => setShowBack(!showBack);
  const handleNext = () => {
    setShowBack(false);
    if (currentIndex < total - 1) setCurrentIndex((prev) => prev + 1);
  };
  const handlePrev = () => {
    setShowBack(false);
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (!currentCard) {
    return <p>Không có flashcard nào để hiển thị.</p>;
  }

  return (
    <div style={{ marginTop: 16 }}>
      <Divider orientation="left">
        Flashcard {currentIndex + 1}/{total}
      </Divider>

      {/* Thẻ flashcard */}
      <div
        className="flashcard-container"
        onClick={handleFlip}
        style={{
          perspective: "1000px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className={`flashcard ${showBack ? "flipped" : ""}`}
          style={{
            width: "100%",
            maxWidth: 420,
            height: 240,
            position: "relative",
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
            cursor: "pointer",
          }}
        >
          {/* Mặt trước */}
          <Card
            className="front"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: 12,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fdcacaff",
            }}
          >
            <h4 style={{ margin: 0, position: "absolute", top: 16, left: 16 }}>
              Câu hỏi:
            </h4>
            <Text style={{ fontSize: 18, whiteSpace: "pre-line" }}>
              {currentCard.front_text || currentCard.frontText}
            </Text>
          </Card>

          {/* Mặt sau */}
          <Card
            className="back"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: 12,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotateY(180deg)",
              background: "#b2f5deff",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
            }}
          >
            <h4 style={{ margin: 0, position: "absolute", top: 16, left: 16 }}>
              Đáp án:
            </h4>
            <Text style={{ fontSize: 18, whiteSpace: "pre-line" }}>
              {currentCard.back_text || currentCard.backText}
            </Text>
          </Card>
        </div>
      </div>

      {/* --- Thông tin trích dẫn tài liệu --- */}
      <FlashcardReference currentCard={currentCard} />

      {/* --- Nút điều hướng --- */}
      <Space style={{ width: "100%", justifyContent: "space-between", marginTop: 16 }}>
        <Button onClick={handlePrev} disabled={currentIndex === 0}>
          <LeftOutlined /> Trước
        </Button>
        <Button
          type="primary"
          onClick={handleNext}
          disabled={currentIndex === total - 1}
        >
          Tiếp<RightOutlined />
        </Button>
      </Space>

      <style>
        {`
          .flashcard.flipped {
            transform: rotateY(180deg);
          }
        `}
      </style>
    </div>
  );
};

export default FlashcardStudySection;
