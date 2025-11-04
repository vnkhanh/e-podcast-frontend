import React, { useState, useEffect, useRef, useCallback } from "react";
import { List, Avatar, Input, Button, message, Space, Modal } from "antd";
import {
  getComments,
  createComment,
  deleteComment,
} from "../../services/api_comment";

const { TextArea } = Input;
const { confirm } = Modal;

const CommentSection = ({ podcastId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = localStorage.getItem("user_id") || storedUser.id || null;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(podcastId);
        setComments(Array.isArray(res) ? res : []);
      } catch {
        message.error("Không thể tải bình luận.");
      }
    };
    fetchComments();
  }, [podcastId]);

  const addReplyRecursively = useCallback((comments, parentId, newReply) => {
    const inner = (items) =>
      (Array.isArray(items) ? items : []).map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: inner(comment.replies),
          };
        }
        return comment;
      });
    return inner(Array.isArray(comments) ? comments : []);
  }, []);

  const removeCommentRecursively = useCallback(
    (comments, commentIdToRemove) => {
      const inner = (items) =>
        items
          .filter((c) => c.id !== commentIdToRemove)
          .map((c) => ({
            ...c,
            replies: c.replies ? inner(c.replies) : [],
          }));
      return inner(Array.isArray(comments) ? comments : []);
    },
    []
  );

  useEffect(() => {
    if (!podcastId || !token) return;
    if (socketRef.current) return;

    const socket = new WebSocket(
      `ws://localhost:8080/ws/podcast/${podcastId}?token=${token}`
    );
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;
        if (data.type === "new_comment" && data.comment) {
          const newComment = data.comment;
          setComments((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            if (newComment.parent_id) {
              return addReplyRecursively(
                safePrev,
                newComment.parent_id,
                newComment
              );
            }
            return [...safePrev, newComment];
          });
        }
        if (data.type === "delete_comment" && data.comment_id) {
          setComments((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return removeCommentRecursively(safePrev, data.comment_id);
          });
          message.success("Bình luận đã được xóa");
        }
      } catch (err) {
        console.error("Lỗi xử lý WebSocket:", err);
      }
    };

    socket.onerror = (err) => console.error("Lỗi WebSocket:", err);
    socket.onclose = () => console.log("Socket closed");

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [podcastId, token, addReplyRecursively, removeCommentRecursively]);

  const handleSubmit = async () => {
    if (!token) return message.warning("Vui lòng đăng nhập để bình luận.");
    if (!content.trim())
      return message.warning("Nội dung bình luận không được để trống.");

    setLoading(true);
    try {
      const payload = {
        podcast_id: podcastId,
        content,
        parent_id: replyTo ? replyTo.id : null,
      };
      await createComment(token, payload);
      setContent("");
      setReplyTo(null);
    } catch {
      message.error("Lỗi khi gửi bình luận.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa bình luận này và tất cả trả lời con?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteComment(token, id);
        } catch (error) {
          message.error("Không thể xóa bình luận");
          console.error("Delete error:", error);
        }
      },
    });
  };

  const toggleReplies = (commentId) => {
    setExpanded((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComment = (item, depth = 0) => {
    const isReply = depth > 0;
    const marginLeft = depth * 32;

    return (
      <div key={item.id}>
        <div
          id={`comment-${item.id}`}
          style={{
            marginBottom: 16,
            marginLeft: marginLeft,
            borderLeft: isReply ? "2px solid #eee" : "none",
            paddingLeft: isReply ? 12 : 0,
            transition: "background-color 1s",
          }}
        >
          <Space align="start">
            <Avatar size={depth > 1 ? "small" : "default"}>
              {item.user_name?.[0] || item.user?.full_name?.[0] || "?"}
            </Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>
                {item.user_name || item.user?.full_name || "Ẩn danh"}{" "}
                {item.user_role && (
                  <span style={{ color: "#888", fontSize: 13 }}>
                    · {item.user_role}
                  </span>
                )}
              </div>

              {item.created_at && (
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  {item.created_at}
                </div>
              )}

              <div style={{ marginBottom: 4 }}>{item.content}</div>

              <div style={{ marginTop: 4 }}>
                <Button
                  type="link"
                  size="small"
                  style={{ paddingLeft: 0 }}
                  onClick={() => setReplyTo(item)}
                >
                  Trả lời
                </Button>

                {String(item.user_id || item.user?.id) === String(userId) && (
                  <Button
                    type="link"
                    size="small"
                    danger
                    style={{ paddingLeft: 8 }}
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </Button>
                )}
              </div>

              {item.replies?.length > 0 && depth === 0 && (
                <div style={{ marginTop: 4 }}>
                  <Button
                    type="link"
                    size="small"
                    style={{ paddingLeft: 0 }}
                    onClick={() => toggleReplies(item.id)}
                  >
                    {expanded[item.id]
                      ? "Ẩn trả lời"
                      : `Xem ${item.replies.length} trả lời`}
                  </Button>
                </div>
              )}
            </div>
          </Space>
        </div>
        {(depth === 0 ? expanded[item.id] : true) &&
          item.replies?.length > 0 &&
          item.replies.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid #eee",
        padding: 16,
        background: "#fff",
      }}
    >
      <List
        itemLayout="vertical"
        dataSource={comments || []}
        renderItem={(item) => renderComment(item, 0)}
      />

      <div style={{ marginTop: 16 }}>
        {replyTo && (
          <div style={{ marginBottom: 8 }}>
            Đang trả lời <strong>{replyTo.user_name || "ẩn danh"}</strong>:{" "}
            <span style={{ color: "#666" }}>
              {replyTo.content.slice(0, 50)}...
            </span>
            <Button type="link" size="small" onClick={() => setReplyTo(null)}>
              Hủy
            </Button>
          </div>
        )}

        <TextArea
          rows={3}
          placeholder="Viết bình luận..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
