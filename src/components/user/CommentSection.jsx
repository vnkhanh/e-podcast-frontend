import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  List,
  Avatar,
  Input,
  Button,
  message,
  Space,
  Modal,
  Card,
  Typography,
  Divider,
} from "antd";
import {
  getComments,
  createComment,
  deleteComment,
} from "../../services/api_comment";
import {
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { confirm } = Modal;
const { Text, Paragraph } = Typography;

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
      `${import.meta.env.VITE_WS_URL}/podcast/${podcastId}?token=${token}`
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
      centered: true,
      okButtonProps: {
        style: {
          borderRadius: 8,
        },
      },
      cancelButtonProps: {
        style: {
          borderRadius: 8,
        },
      },
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
            borderLeft: isReply ? "3px solid #f0f0f0" : "none",
            paddingLeft: isReply ? 16 : 0,
            transition: "all 0.3s ease",
            borderRadius: 8,
            padding: "12px 16px",
          }}
          className="comment-item"
        >
          <Space align="start" style={{ width: "100%" }}>
            <Avatar
              size={depth > 1 ? "small" : "default"}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
              }}
              icon={<UserOutlined />}
            >
              {item.user_name?.[0] || item.user?.full_name?.[0] || "?"}
            </Avatar>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Text strong style={{ fontSize: 14 }}>
                  {item.user_name || item.user?.full_name || "Ẩn danh"}
                </Text>
                {item.user_role && (
                  <span
                    style={{
                      color: "#667eea",
                      fontSize: 12,
                      background: "rgba(102, 126, 234, 0.1)",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontWeight: 500,
                    }}
                  >
                    {item.user_role}
                  </span>
                )}
              </div>

              {item.created_at && (
                <div style={{ color: "#999", fontSize: 12, marginBottom: 8 }}>
                  {item.created_at}
                </div>
              )}

              <Paragraph
                style={{
                  margin: 0,
                  lineHeight: 1.5,
                  fontSize: 14,
                }}
              >
                {item.content}
              </Paragraph>

              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => setReplyTo(item)}
                  style={{
                    color: "#667eea",
                    fontSize: 12,
                    height: 24,
                    padding: "0 8px",
                  }}
                >
                  Trả lời
                </Button>

                {String(item.user_id || item.user?.id) === String(userId) && (
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.id)}
                    style={{
                      fontSize: 12,
                      height: 24,
                      padding: "0 8px",
                    }}
                  >
                    Xóa
                  </Button>
                )}
              </div>

              {item.replies?.length > 0 && depth === 0 && (
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="link"
                    size="small"
                    icon={
                      expanded[item.id] ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )
                    }
                    onClick={() => toggleReplies(item.id)}
                    style={{
                      paddingLeft: 0,
                      fontSize: 12,
                      color: "#667eea",
                      height: 24,
                    }}
                  >
                    {expanded[item.id] ? "Ẩn trả lời" : `Xem trả lời`}
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
    <Card
      style={{
        borderRadius: 16,
        border: "none",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ marginBottom: 24 }}>
        <Text
          strong
          style={{
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MessageOutlined style={{ color: "#667eea" }} /> Bình luận (
          {comments.length})
        </Text>
      </div>

      {/* COMMENT INPUT SECTION */}
      <div
        style={{
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          border: "1px solid #f0f0f0",
        }}
      >
        {replyTo && (
          <div
            style={{
              marginBottom: 12,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e6f7ff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text strong style={{ fontSize: 12, color: "#1890ff" }}>
                Đang trả lời {replyTo.user_name || "ẩn danh"}
              </Text>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => setReplyTo(null)}
                style={{ height: 20, width: 20, minWidth: 20 }}
              />
            </div>
            <Text style={{ fontSize: 12 }}>
              {replyTo.content.slice(0, 80)}...
            </Text>
          </div>
        )}

        <TextArea
          rows={3}
          placeholder="Viết bình luận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            borderRadius: 8,
            border: "1px solid #e8e8e8",
            resize: "vertical",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            {token
              ? "Bình luận hiển thị " + (storedUser.full_name || "Người dùng")
              : "Vui lòng đăng nhập để bình luận"}
          </Text>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            disabled={!content.trim()}
            icon={<SendOutlined />}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: 8,
              fontWeight: 500,
              height: 36,
              padding: "0 20px",
            }}
          >
            Gửi bình luận
          </Button>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* COMMENTS LIST */}
      {comments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <MessageOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <Text type="secondary" style={{ display: "block" }}>
            Chưa có bình luận nào
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Hãy là người đầu tiên bình luận về podcast này
          </Text>
        </div>
      ) : (
        <div style={{ maxHeight: 600, overflow: "auto" }}>
          {comments.map((item) => renderComment(item, 0))}
        </div>
      )}
    </Card>
  );
};

export default CommentSection;
