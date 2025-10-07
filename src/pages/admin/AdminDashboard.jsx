import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  SoundOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const AdminDashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Thống kê tổng quan</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Podcast"
              value={128}
              prefix={<SoundOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={540}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tài liệu"
              value={320}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt nghe"
              value={15230}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h3>Biểu đồ lượt nghe theo tháng</h3>
        <div
          style={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#999",
          }}
        >
          (Chart placeholder)
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
