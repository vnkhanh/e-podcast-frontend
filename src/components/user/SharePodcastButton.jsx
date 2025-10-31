import React, { useState } from "react";
import { Button, Dropdown, Menu, message, Modal, Input } from "antd";
import {
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  CopyOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import WhatsappOutlined from "@ant-design/icons/WhatsappOutlined";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

const SharePodcastButton = ({ podcastId, podcastTitle }) => {
  const [link, setLink] = useState("");
  const [qrVisible, setQrVisible] = useState(false);

  const fetchLink = async () => {
    if (link) return link;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/podcasts/${podcastId}/share-social`
      );
      setLink(res.data.link);
      return res.data.link;
    } catch (err) {
      console.error(err);
      message.error("Không thể lấy link chia sẻ");
    }
  };

  const handleShare = async (platform) => {
    const shareLink = await fetchLink();
    if (!shareLink) return;

    const encodedLink = encodeURIComponent(shareLink);
    let url = "";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedLink}&text=Nghe podcast: ${encodeURIComponent(
          podcastTitle
        )}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=Nghe podcast: ${encodeURIComponent(
          podcastTitle
        )} ${encodedLink}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareLink);
        message.success("Đã copy link vào clipboard!");
        return;
      case "qr":
        setQrVisible(true);
        return;
      default:
        return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  const menu = (
    <Menu>
      <Menu.Item
        icon={<FacebookOutlined />}
        onClick={() => handleShare("facebook")}
      >
        Facebook
      </Menu.Item>
      <Menu.Item
        icon={<TwitterOutlined />}
        onClick={() => handleShare("twitter")}
      >
        Twitter
      </Menu.Item>
      <Menu.Item
        icon={<LinkedinOutlined />}
        onClick={() => handleShare("linkedin")}
      >
        LinkedIn
      </Menu.Item>
      <Menu.Item
        icon={<WhatsappOutlined />}
        onClick={() => handleShare("whatsapp")}
      >
        WhatsApp
      </Menu.Item>
      <Menu.Item icon={<CopyOutlined />} onClick={() => handleShare("copy")}>
        Copy link
      </Menu.Item>
      <Menu.Item icon={<QrcodeOutlined />} onClick={() => handleShare("qr")}>
        QR Code
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
        <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
      </Dropdown>

      <Modal
        visible={qrVisible}
        title={`QR Code - ${podcastTitle}`}
        onCancel={() => setQrVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          {link ? <QRCodeCanvas value={link} size={200} /> : <p>Đang tải...</p>}
          <div style={{ marginTop: 16 }}>
            <Input value={link} readOnly />
            <Button
              style={{ marginTop: 8 }}
              block
              onClick={() => {
                navigator.clipboard.writeText(link);
                message.success("Đã copy link!");
              }}
            >
              Copy link
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SharePodcastButton;
