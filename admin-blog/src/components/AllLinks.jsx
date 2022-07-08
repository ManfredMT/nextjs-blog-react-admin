import { LinkOutlined, LoadingOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Dropdown,
  Menu,
  message as antMessage,
  Modal,
  Spin
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "../css/AllLinks.module.css";
import { deleteLink, getLinks, reset } from "../features/links/linkSlice";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);


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

  useEffect(() => {
    if (isError) {
      antMessage.error(message);
    }

    dispatch(getLinks());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (isSuccess && message !== "") {
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

  const handleCancel = (e) => {
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

  //异步加载图片(有bug)
  // const [imageSrcs, setImageSrcs] = useState([]);
  // useEffect(() => {
  //   console.log("run inside useEffect");
  //   rnLinks.forEach(({ picture }, i) => {
  //     if (picture) {
  //       console.log("picture and type: ", picture.data, typeof picture.data);
  //       const imgArrayBuffer = new Uint8Array(picture.data).buffer;
  //       const imgBlob = new Blob([imgArrayBuffer], {
  //         /* { type: "image/jpeg" } */
  //       });
  //       const reader = new FileReader();
  //       reader.readAsDataURL(imgBlob);
  //       reader.onloadend = function () {
  //         const imgSrcs = imageSrcs.slice();
  //         imgSrcs[i] = reader.result;
  //         setImageSrcs(imgSrcs);
  //       };
  //     }
  //   });
  // }, []);

  

  return !isLoading?(
    <>
      <div className={style["links-box"]}>
        {rnLinks.map(
          ({ _id, linkName, description, linkAddress, picture }, i) => {
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
              const imgArrayBuffer = new Uint8Array(picture.data).buffer;
              const imgBlob = new Blob([imgArrayBuffer], {
                // type: "image/jpeg"
              });

              avatarNode = (
                <Avatar
                  src={URL.createObjectURL(imgBlob)}
                  //src={imageSrcs[i]}
                  shape="square"
                  size={64}
                />
              );
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
                    <a onClick={(e) => e.preventDefault()}>
                      <MoreOutlined className={style["menu-button"]} />
                    </a>
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
  ):<Spin className={style["spin-center"]} indicator={antIcon} />;
}

export default AllLinks;
