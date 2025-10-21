import { Card, Avatar, Space, Tag, Typography, Button } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { formatTime } from "../../../utils/helpers";
import "./FeaturedPodcastCard.css";
const { Text, Paragraph } = Typography;
const { Meta } = Card;

const FeaturedPodcastCard = ({ podcast, playerState }) => {
  const { currentPodcast, isPlaying, handlePlay } = playerState;
  const isCurrentlyPlaying = currentPodcast?.id === podcast.id && isPlaying;

  return (
    <Card
      className="featured-podcast-card"
      cover={
        <div className="featured-cover">
          <img alt={podcast.title} src={podcast.cover_image} />
          <div className="play-overlay">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={
                isCurrentlyPlaying ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              onClick={() => handlePlay(podcast)}
            />
          </div>
        </div>
      }
    >
      <Meta
        avatar={<Avatar size="large" src={podcast.cover_image} />}
        title={
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>{podcast.title}</Text>
            {/* <Text type="secondary" style={{ fontSize: "12px" }}>
              {podcast?.chapter.subject.name}
            </Text> */}
          </Space>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, fontSize: "12px" }}
            >
              {podcast.description}
            </Paragraph>
            <Space>
              <Tag color="blue">{podcast.categories[0]?.name}</Tag>
              <Tag color="green">{formatTime(podcast.duration_sec)}</Tag>
            </Space>
          </Space>
        }
      />
    </Card>
  );
};

export default FeaturedPodcastCard;
