import { Button, Modal, message as antMessage, Dropdown, Input } from "antd";
import { useState, useRef } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PictureOutlined, EditOutlined } from "@ant-design/icons";

function ImageCard({
  title,
  date,
  imgSrc,
  imgId,
  setImages,
  description,
  setIsLightboxOpen,
  setOpenImageId,
}) {
  const [isModalDelOpen, setIsModalDelOpen] = useState(false);
  const [isModalLinkOpen, setIsModalLinkOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [descriptionInput, setDescriptionInput] = useState(description);
  // const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);

  const imgRef = useRef(null);

  const sliceTitle = title.length > 20 ? title.slice(0, 20) + "..." : title;
  const markdown = `![${title}](${window.location.origin}${imgSrc} "${title}")`;
  const link = `${window.location.origin}${imgSrc}`;

  const handleClickDelete = () => {
    setIsModalDelOpen(true);
  };
  const handleMouseEnter = () => {
    setIsImgHovered(true);
  };

  const handleMouseLeave = () => {
    setIsImgHovered(false);
  };
  const handleOk = () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    axios
      .delete("/api/images/" + imgId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsModalDelOpen(false);
        antMessage.success("图片已删除");
        //更新所有图片
        axios
          .get("/api/images", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setImages(response.data.reverse());
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        antMessage.error("请求出错");
        console.error(error);
      });
  };
  const handleCancel = () => {
    setIsModalDelOpen(false);
  };
  const handleClickLink = () => {
    setIsModalLinkOpen(true);
  };
  const handleCancelLink = () => {
    setIsModalLinkOpen(false);
  };
  const items = [
    {
      label: "查看图片信息",
      key: "1",
      icon: <PictureOutlined />,
    },
    { label: "修改图片信息", key: "2", icon: <EditOutlined /> },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      setIsModalInfoOpen(true);
    } else if (e.key === "2") {
      setIsModalEditOpen(true);
      setTitleInput(title);
      setDescriptionInput(description);
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleCancelInfo = () => {
    setIsModalInfoOpen(false);
  };

  const handleOkEdit = () => {
    if (titleInput) {
      const token = JSON.parse(localStorage.getItem("user")).token;
      let reqBody = { title: titleInput };
      if (descriptionInput) {
        reqBody.description = descriptionInput;
      }
      axios
        .put("/api/images/" + imgId, reqBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setIsModalEditOpen(false);
          antMessage.success("图片信息已修改");
          //更新所有图片
          axios
            .get("/api/images", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setImages(response.data.reverse());
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          antMessage.error("修改请求出错");
          console.error(error);
        });
    } else {
      antMessage.error("未设置图片名称");
    }
  };

  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
  };

  // const slides = [{ src: imgSrc, alt: title, title, description }];

  return (
    <div
      style={{
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "0.5rem",
        borderRadius: "8px",
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: "400" }}>{sliceTitle}</div>

      <div style={{ fontSize: "0.8rem", color: "GrayText" }}>
        {new Date(date).toLocaleString()}
      </div>
      <img
        alt={title}
        ref={imgRef}
        style={{
          width: "100%",
          height: "170px",
          objectFit: "contain",
          cursor: "pointer",
          boxShadow: isImgHovered
            ? "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            : "initial",
        }}
        src={imgSrc}
        onClick={() => {
          setOpenImageId(imgId);
          setIsLightboxOpen(true);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <div style={{ display: "flex", paddingLeft: "0", paddingRight: "0" }}>
        <Button
          danger
          style={{ marginRight: "0.5rem" }}
          onClick={handleClickDelete}
        >
          删除
        </Button>
        <Modal
          title="删除图片"
          open={isModalDelOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>确认删除图片:</p>
          <p>{title}</p>
        </Modal>
        <Button onClick={handleClickLink}>查看链接</Button>
        <Modal
          title="图片链接和markdown"
          open={isModalLinkOpen}
          onCancel={handleCancelLink}
          footer={null}
        >
          <div>
            Markdown代码:{" "}
            <div
              style={{
                border: "1px solid lightgrey",
                borderRadius: "8px",
                padding: "0.5rem",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              {markdown}
            </div>
            <CopyToClipboard
              text={markdown}
              onCopy={() => {
                antMessage.success("Markdown代码已复制");
              }}
            >
              <Button size="small">复制</Button>
            </CopyToClipboard>
          </div>
          <br />
          <div>
            外链:{" "}
            <div
              style={{
                border: "1px solid lightgrey",
                borderRadius: "8px",
                padding: "0.5rem",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              {link}
            </div>
            <CopyToClipboard
              text={link}
              onCopy={() => {
                antMessage.success("外链已复制");
              }}
            >
              <Button size="small">复制</Button>
            </CopyToClipboard>
          </div>
        </Modal>
        <Dropdown menu={menuProps} trigger={["click"]}>
          <Button style={{ marginLeft: "auto" }}>更多</Button>
        </Dropdown>

        <Modal
          title="图片信息"
          open={isModalInfoOpen}
          footer={null}
          onCancel={handleCancelInfo}
        >
          <p>名称: {title}</p>
          <p>介绍: {description}</p>
          <p>格式: {imgSrc.substring(imgSrc.lastIndexOf("."))}</p>
          <p>宽度: {imgRef.current?.naturalWidth}</p>
          <p>高度: {imgRef.current?.naturalHeight}</p>
        </Modal>
        <Modal
          title="修改图片信息"
          open={isModalEditOpen}
          onOk={handleOkEdit}
          onCancel={handleCancelEdit}
        >
          <label>
            名称:
            <Input
              name="title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="图片名称"
              allowClear
            />
          </label>
          <label style={{ display: "block", marginTop: "1rem" }}>
            介绍(选填):
            <Input.TextArea
              name="description"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="图片介绍(可不填)"
              autoSize={{
                minRows: 2,
                maxRows: 5,
              }}
            />
          </label>
        </Modal>
      </div>
    </div>
  );
}

export default ImageCard;
