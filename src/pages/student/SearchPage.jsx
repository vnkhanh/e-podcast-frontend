import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { List, Card, Typography, Pagination, Spin, Empty, message } from "antd";
import { searchFull } from "../../services/api_search";

const { Title } = Typography;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || "";

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const fetchResults = async (pageNumber = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchFull(query, pageNumber, perPage);
      setResults(data.results);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi lấy kết quả tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(page);
  }, [query, page]);

  return (
    <div style={{ padding: "20px 40px" }}>
      <Title level={3}>Kết quả tìm kiếm: "{query}"</Title>

      {loading ? (
        <Spin
          tip="Đang tìm kiếm..."
          style={{ display: "block", marginTop: 50 }}
        />
      ) : results.length === 0 ? (
        <Empty description="Không tìm thấy kết quả" />
      ) : (
        <>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={results}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  title={item.title || item.name}
                  onClick={() => {
                    if (item.type === "podcast")
                      navigate(`/podcast/${item.id}`);
                    else navigate(`/subjects/${item.slug}`);
                  }}
                  style={{ height: "100%" }}
                >
                  {item.type === "podcast" && item.description && (
                    <p>{item.description.slice(0, 80)}...</p>
                  )}
                  <p style={{ fontStyle: "italic", marginTop: 8 }}>
                    {item.type === "podcast" ? "🎧 Podcast" : "📚 Môn học"}
                  </p>
                </Card>
              </List.Item>
            )}
          />

          {total > perPage && (
            <Pagination
              current={page}
              pageSize={perPage}
              total={total}
              onChange={(p) => setPage(p)}
              style={{ textAlign: "center", marginTop: 20 }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
