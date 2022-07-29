import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message as antMessage,
  Spin,
  Upload,
  Modal,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/NewLink.module.css";
import { getLinks, reset, updateLink } from "../features/links/linkSlice";

const validateMessages = {
  required: "${label}不能为空!",
  types: {
    url: "${label}不是有效的链接!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditLink = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { links, isSuccess, isError, message } = useSelector(
    (state) => state.links
  );
  console.log("links in EditLink: ", links);

  const currentLink = links.find((link) => link._id === params.linkId);
  console.log("current link: ", currentLink);

  const formRef = useRef(null);

  let isImgValid = false;

  useEffect(() => {
    dispatch(getLinks());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      console.log(message);
      antMessage.error(message);
    }
    if (isSuccess && message === "友链已更改") {
      console.log("成功修改友链");
      antMessage.success(message);
    }
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    if (links.length !== 0) {
      const linkIndex = links.findIndex((link) => link._id === params.linkId);
      console.log("link index: ", linkIndex);
      if (linkIndex === -1) {
        navigate("../all-links");
      }
    }
  }, [links, navigate, params]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const onFinish = (values) => {
    console.log(values);
    const linkFormData = new FormData();
    linkFormData.append("name", values.link.name);
    linkFormData.append("website", values.link.address);
    linkFormData.append("linkId", params.linkId);
    if (values.link.introduction) {
      linkFormData.append("description", values.link.introduction);
    } else {
      linkFormData.append("description", "");
    }
    if (values.dragger && isImgValid) {
      console.log("uploaded image: ", values.dragger);
      const imageFile = values.dragger[0].originFileObj;
      linkFormData.append("picture", imageFile);
    }
    dispatch(updateLink(linkFormData));
    navigate("../all-links");
  };

  const handleImageUpload = (e) => {
    console.log("upload image: ", e);
    const file = e.file;
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      isImgValid = false;
      antMessage.error("只能上传jpeg或者png格式的图片,请重新选择!");
      setTimeout(() => {
        e.onError("file type error");
      }, 0);
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      isImgValid = false;
      antMessage.error("图片大小必须小于3MB,请重新选择!");
      setTimeout(() => {
        e.onError("file size error");
      }, 0);
    }
    if (isJpgOrPng && isLt3M) {
      isImgValid = true;
      setTimeout(() => {
        e.onSuccess("ok");
      }, 0);
    }
  };

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const handleCancel = () => {
    dispatch(reset());
    navigate("../all-links");
  };

  const formInit = currentLink
    ? {
        link: {
          name: currentLink.name,
          address: currentLink.website,
          introduction: currentLink.description,
        },
      }
    : {};

  const getDefaultImg = () => {
    if (!currentLink) {
      return null;
    }
    if (currentLink.picture) {
      const imgArrayBuffer = new Uint8Array(currentLink.picture.data).buffer;
      const imgBlob = new Blob([imgArrayBuffer], {
        // type: "image/jpeg"
      });
      const imgUrl = URL.createObjectURL(imgBlob);
      return [
        {
          uid: "-1",
          name: "友链图标",
          status: "done",
          url: imgUrl,
        },
      ];
    } else {
      return null;
    }
  };

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const renderForm = (
    <Form
      ref={formRef}
      className={style["new-link-form"]}
      labelCol={
        isTabletOrMobile
          ? null
          : {
              span: 8,
            }
      }
      wrapperCol={
        isTabletOrMobile
          ? null
          : {
              span: 16,
            }
      }
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
      initialValues={formInit}
    >
      <Form.Item
        name={["link", "name"]}
        label={isTabletOrMobile ? null : "友链名称"}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={isTabletOrMobile ? "友链名称(必填)" : null} />
      </Form.Item>
      <Form.Item
        name={["link", "address"]}
        label={isTabletOrMobile ? null : "友链网址"}
        rules={[
          {
            required: true,
            type: "url",
          },
        ]}
      >
        <Input placeholder={isTabletOrMobile ? "友链网址(必填)" : null} />
      </Form.Item>

      <Form.Item name={["link", "introduction"]} label="网站介绍">
        <Input.TextArea
          placeholder="网站介绍"
          autoSize={{ minRows: 2 }}
          showCount
          maxLength={200}
        />
      </Form.Item>

      <Form.Item label="网站图标">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload.Dragger
            maxCount={1}
            listType="picture"
            name="files"
            //action="/upload.do"
            customRequest={handleImageUpload}
            defaultFileList={getDefaultImg}
            onPreview={handlePreview}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传图片</p>
            <p className="ant-upload-hint">
              支持jpeg和png格式,文件大小上限为3M.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="link_image"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>

      <Form.Item className={style["submit-button-box"]}>
        <Button
          className={style["submit-button-edit"]}
          type="primary"
          htmlType="submit"
        >
          确认修改
        </Button>
        <Button
          className={style["cancel-button"]}
          type="primary"
          onClick={handleCancel}
        >
          取消
        </Button>
      </Form.Item>
    </Form>
  );

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return currentLink ? (
    renderForm
  ) : (
    <Spin className={style["spin-center"]} indicator={antIcon} />
  );
};

export default EditLink;
