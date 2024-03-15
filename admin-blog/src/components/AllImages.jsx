import { useEffect, useState, useRef } from "react";
import HCenterSpin from "./HCenterSpin";
import axios from "axios";
import {
  message as antMessage,
  Pagination,
  Button,
  Space,
  Dropdown,
  Divider,
  Modal,
  Upload,
  Input,
  Progress,
} from "antd";
import {
  InboxOutlined,
  FileImageOutlined,
  DownOutlined,
  FolderOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import ImageCard from "./ImageCard";
import style from "../css/AllImages.module.css";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

function AllImages() {
  const [images, setImages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMultiOpen, setIsModalMultiOpen] = useState(false);
  const [isModalDirOpen, setIsModalDirOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState("normal");
  const [uploadVersion, setUploadVersion] = useState(0);
  const [multiUploadVersion, setMultiUploadVersion] = useState(0);
  const [dirUploadVersion, setDirUploadVersion] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [openImageId, setOpenImageId] = useState(null);
  const imageFile = useRef(null);

  useEffect(() => {
    let ignore = false;
    const token = JSON.parse(localStorage.getItem("user")).token;
    axios
      .get("/api/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log(response.data);
        if (!ignore) {
          setImages(response.data.reverse());
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!ignore) {
          antMessage.error("请求出错");
          console.error(error);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);
  //console.log(images);

  const items = [
    {
      label: "单个图片文件",
      key: "1",
      icon: <FileImageOutlined />,
    },
    {
      label: "多个图片文件",
      key: "2",
      icon: <FileAddOutlined />,
    },
    {
      label: "文件夹",
      key: "3",
      icon: <FolderOutlined />,
    },
  ];

  const defaultPageSize = 20;

  const handleShowTotal = (total, range) => {
    //console.log("total: ", total, " range: ", range);
    if (!(range[0] - 1 === (currentPage - 1) * defaultPageSize)) {
      //console.log("currentPage ?")
      setCurrentPage((range[0] - 1) / defaultPageSize + 1);
    }
  };

  const onChange = (pageNumber) => {
    //console.log("Page: ", pageNumber);
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  let currentPageImages = [];

  if (!isLoading) {
    currentPageImages = images.slice(
      (currentPage - 1) * defaultPageSize,
      currentPage * defaultPageSize > images.length
        ? images.length
        : currentPage * defaultPageSize
    );
  }

  let slides = currentPageImages.map((img) => {
    return {
      src: img.imageUrl,
      alt: img.title,
      title: img.title,
      description: img.description,
    };
  });

  let lightboxIndex = 0;
  if (openImageId) {
    lightboxIndex = currentPageImages.findIndex((i) => i._id === openImageId);
  }

  const handleMenuClick = (e) => {
    //console.log("click", e);
    if (e.key === "1") {
      setIsModalOpen(true);
    } else if (e.key === "2") {
      setIsModalMultiOpen(true);
    } else if (e.key === "3") {
      setIsModalDirOpen(true);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleOk = () => {
    if (!imageFile.current) {
      antMessage.error("未上传图片文件");
    } else if (!title) {
      antMessage.error("未设置图片名称");
    } else {
      setSubmitBtnLoading(true);
      let imageData = {
        title,
        image: imageFile.current,
      };
      if (description) {
        imageData.description = description;
      }
      setProgressStatus("active");
      const token = JSON.parse(localStorage.getItem("user")).token;
      axios
        .post("/api/images", imageData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            // 处理原生进度事件
            const percentage = (
              (progressEvent.loaded * 100) /
              progressEvent.total
            ).toFixed(1);
            setProgressPercent(percentage);
          },
        })
        .then((res) => {
          antMessage.success("上传图片完成");
          setSubmitBtnLoading(false);
          setIsModalOpen(false);
          setTitle(null);
          setDescription(null);
          setProgressPercent(0);
          setProgressStatus("normal");
          //通过向Upload组件传递不同的 key 来重置组件的状态。
          setUploadVersion(uploadVersion + 1);
          axios
            .get("/api/images", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setImages(response.data.reverse());
              setIsLoading(false);
            })
            .catch((error) => {
              antMessage.error("请求出错");
              console.error(error);
            });
        })
        .catch((error) => {
          setProgressStatus("exception");
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          //console.log("message: ",message);
          antMessage.error(message);
          setSubmitBtnLoading(false);
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelMulti = () => {
    setIsModalMultiOpen(false);
    setMultiUploadVersion(multiUploadVersion + 1);
  };

  const handleOkMulti = () => {
    setIsModalMultiOpen(false);
    setMultiUploadVersion(multiUploadVersion + 1);
    //更新所有图片
    const token = JSON.parse(localStorage.getItem("user")).token;
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
  };

  const handleCancelDir = () => {
    setIsModalDirOpen(false);
    setDirUploadVersion(dirUploadVersion + 1);
  };

  const handleOkDir = () => {
    setIsModalDirOpen(false);
    setDirUploadVersion(dirUploadVersion + 1);
    //更新所有图片
    const token = JSON.parse(localStorage.getItem("user")).token;
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
  };

  const handleImageUpload = (e) => {
    const file = e.file;
    //console.log("file:", file);
    const isImage = file.type.startsWith("image");
    if (!isImage) {
      //setIsImgValid(false);
      antMessage.error("只能上传图片文件,请重新选择!");
      setTimeout(() => {
        e.onError("file type error");
      }, 0);
    } else {
      const fileName = file.name;
      setTitle(fileName.substring(0, fileName.lastIndexOf(".")));
      imageFile.current = file;
      setTimeout(() => {
        e.onSuccess("ok");
      }, 0);
    }
  };

  const handlePreview = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setPreviewImage(reader.result);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      setPreviewVisible(true);
    });
    if (file) {
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handlePreviewCard = (file) => {
    const url = window.location.origin + file.response.imageUrl;
    window.open(url, "_blank", "popup");
  };

  return isLoading ? (
    <HCenterSpin />
  ) : (
    <div className={style["all-images-box"]}>
      <div className={style["move-to-right"]}>
        <Dropdown
          placement="bottomRight"
          overlayClassName={style["dropdown"]}
          menu={menuProps}
          trigger={["click"]}
        >
          <Button type="primary">
            <Space>
              上传图片
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>

      <Modal
        title="单个图片文件上传"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitBtnLoading}
            disabled={submitBtnLoading}
            onClick={handleOk}
          >
            确认上传
          </Button>,
        ]}
      >
        <div>
          <Upload.Dragger
            key={uploadVersion}
            accept="image/*"
            maxCount={1}
            defaultFileList={[]}
            listType="picture"
            name="images"
            customRequest={handleImageUpload}
            onPreview={handlePreview}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传图片</p>
            <p className="ant-upload-hint">支持各种图片格式,文件大小不限.</p>
          </Upload.Dragger>
          <Progress percent={progressPercent} status={progressStatus} />
          <label className={style["title-label"]}>
            名称:
            <Input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="图片名称"
              allowClear
            />
          </label>
          <label className={style["description-label"]}>
            介绍(选填):
            <Input.TextArea
              name="description"
              allowClear
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="图片介绍(可不填)"
              autoSize={{
                minRows: 2,
                maxRows: 5,
              }}
            />
          </label>
        </div>
      </Modal>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="image_file"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
      <Modal
        title="多个图片文件上传"
        open={isModalMultiOpen}
        onOk={handleOkMulti}
        onCancel={handleCancelMulti}
      >
        <div>
          <Upload.Dragger
            key={multiUploadVersion}
            action="/api/images"
            name="image"
            multiple={true}
            data={(file) => {
              const fileName = file.name;
              return {
                title: fileName.substring(0, fileName.lastIndexOf(".")),
              };
            }}
            headers={{
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            }}
            showUploadList={{
              showRemoveIcon: false,
            }}
            accept="image/*"
            defaultFileList={[]}
            listType="picture-card"
            onPreview={handlePreviewCard}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传图片</p>
            <p className="ant-upload-hint">
              支持选择多个文件.支持各种图片格式,文件大小不限.
            </p>
          </Upload.Dragger>
        </div>
      </Modal>
      <Modal
        title="文件夹图片上传"
        open={isModalDirOpen}
        onOk={handleOkDir}
        onCancel={handleCancelDir}
      >
        <div>
          <Upload.Dragger
            key={dirUploadVersion}
            action="/api/images"
            name="image"
            directory={true}
            data={(file) => {
              const fileName = file.name;
              return {
                title: fileName.substring(0, fileName.lastIndexOf(".")),
              };
            }}
            headers={{
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            }}
            showUploadList={{
              showRemoveIcon: false,
            }}
            accept="image/*"
            defaultFileList={[]}
            listType="picture-card"
            onPreview={handlePreviewCard}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传图片</p>
            <p className="ant-upload-hint">
              支持选择仅包含图片的文件夹.支持各种图片格式,文件大小不限.
            </p>
          </Upload.Dragger>
        </div>
      </Modal>
      <div className={style["small-title"]}>共{images.length}张图片</div>
      <Divider className={style["divider"]} />
      <div className={style["grid-wrapper"]}>
        {currentPageImages.map((image) => (
          <ImageCard
            key={image._id}
            title={image.title}
            date={image.createdAt}
            imgSrc={image.imageUrl}
            imgId={image._id}
            setImages={setImages}
            description={image.description}
            setIsLightboxOpen={setIsLightboxOpen}
            setOpenImageId={setOpenImageId}
          />
        ))}
      </div>
      <Lightbox
        slides={slides}
        index={lightboxIndex}
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        plugins={[Captions, Download, Zoom, Thumbnails]}
        animation={{ zoom: 500 }}
        zoom={{
          maxZoomPixelRatio: 4,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 1000,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
      />
      <div className={style["move-to-right"]}>
        <Pagination
          showQuickJumper
          total={images.length}
          defaultPageSize={defaultPageSize}
          showSizeChanger={false}
          onChange={onChange}
          showTotal={handleShowTotal}
        />
      </div>
    </div>
  );
}

export default AllImages;
