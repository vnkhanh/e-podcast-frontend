import React, { useRef } from "react";
import { Tag } from "antd";

const TagScroller = ({ tags }) => {
  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    scrollRef.current.classList.add("active");
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    scrollRef.current.classList.remove("active");
  };

  const handleMouseUp = () => {
    isDown = false;
    scrollRef.current.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // tốc độ kéo
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      className="tag-scroll"
      style={{
        display: "flex",
        overflowX: "auto",
        gap: 6,
        marginTop: 10,
        paddingBottom: 4,
        cursor: "grab",
        userSelect: "none",
        scrollbarWidth: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {tags?.slice(0, 10).map((c) => (
        <Tag
          key={c.id}
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            color: "#3b82f6",
            border: "none",
            fontSize: 10,
            fontWeight: 500,
            borderRadius: 10,
            padding: "2px 8px",
            whiteSpace: "nowrap",
          }}
        >
          #{c.name}
        </Tag>
      ))}
    </div>
  );
};

export default TagScroller;
