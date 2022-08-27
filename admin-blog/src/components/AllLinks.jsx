import { LinkOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Dropdown, Empty, Menu,
  message as antMessage,
  Modal
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "../css/AllLinks.module.css";
import {
  deleteLink,
  getLinks,
  reset,
  resetError
} from "../features/links/linkSlice";
import useGetData from "../hooks/useGetData";
import HCenterSpin from "./HCenterSpin";

function AllLinks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { links, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.links
  );

  const rnLinks = links.map((link) => {
    return {
      linkName: link.name,
      linkAddress: link.website,
      ...link,
    };
  });

  useGetData(getLinks, reset, isError, message, resetError);
  useEffect(() => {
    if (isSuccess && message === "成功删除友链") {
      antMessage.success(message);
    }
  }, [isSuccess, message]);

  const { Meta } = Card;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const linkId = useRef("");
  const handleOk = (e) => {
    if (linkId.current !== "") {
      dispatch(deleteLink(linkId.current));
    } else {
      antMessage.error("删除失败");
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLinkMenuClick = ({ _id, linkAddress }) => {
    return ({ key }) => {
      if (key === "delete-link") {
        linkId.current = _id;
        setIsModalVisible(true);
      }
      if (key === "open-link") {
        window.open(linkAddress, "_blank", "noopener noreferrer");
      }
      if (key === "update-link") {
        navigate(`../${_id}`);
      }
    };
  };

  const getMenu = ({ _id, linkName, description, linkAddress }) => {
    return (
      <Menu
        items={[
          { label: "进入链接", key: "open-link" },
          { label: "修改友链", key: "update-link" },
          { label: "删除友链", key: "delete-link" },
        ]}
        onClick={handleLinkMenuClick({
          _id,
          linkName,
          description,
          linkAddress,
        })}
      ></Menu>
    );
  };

  return !isLoading ? (
    <>
      {rnLinks.length === 0 ? (
        <Empty />
      ) : (
        <div className={style["links-box"]}>
          {rnLinks.map(
            ({ _id, linkName, description, linkAddress, picture }) => {
              let avatarNode = (
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                  }}
                  icon={<LinkOutlined />}
                  shape="square"
                  size={64}
                />
              );
              if (picture) {
                avatarNode = <Avatar src={picture} shape="square" size={64} />;
              }
              return (
                <Card
                  key={_id}
                  title={linkName}
                  extra={
                    <Dropdown
                      overlay={getMenu({
                        _id,
                        linkName,
                        description,
                        linkAddress,
                      })}
                      trigger={["click"]}
                    >
                      <button
                        style={{
                          background: "none",
                          color: "inherit",
                          border: "none",
                          padding: 0,
                          font: "inherit",
                          outline: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <MoreOutlined className={style["menu-button"]} />
                      </button>
                    </Dropdown>
                  }
                >
                  <Meta
                    avatar={avatarNode}
                    title={
                      <a href={linkAddress} target="_blank" rel="noreferrer">
                        {linkAddress}
                      </a>
                    }
                    description={description}
                  />
                </Card>
              );
            }
          )}
        </div>
      )}
      <Modal
        title="删除友链"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>确定删除友链?</p>
      </Modal>
    </>
  ) : (
    <HCenterSpin />
  );
}

export default AllLinks;
