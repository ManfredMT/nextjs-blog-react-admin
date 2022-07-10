import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, message as antMessage, Upload } from "antd";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/NewLink.module.css";
import { createLink, reset } from "../features/links/linkSlice";

const validateMessages = {
  required: "${label}不能为空!",
  types: {
    url: "${label}不是有效的链接!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const NewLink = () => {
  const dispatch = useDispatch();

  const { isSuccess, isError, message } = useSelector((state) => state.links);

  const formRef = useRef(null);

  let isImgValid = false;

  useEffect(() => {
    if (isError) {
      console.log(message);
      antMessage.error(message);
    }
    if (isSuccess && message === "成功创建友链") {
      console.log("成功创建友链");
      antMessage.success(message);
      formRef.current.resetFields();
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, dispatch]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const onFinish = (values) => {
    console.log(values);
    const linkFormData = new FormData();
    linkFormData.append("name", values.link.name);
    linkFormData.append("website", values.link.address);
    if (values.link.introduction) {
      linkFormData.append("description", values.link.introduction);
    }
    if (values.dragger && isImgValid) {
      console.log("uploaded image: ", values.dragger[0].originFileObj);
      const imageFile = values.dragger[0].originFileObj;
      linkFormData.append("picture", imageFile);
    }
    dispatch(createLink(linkFormData));
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

  return (
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
            //beforeUpload={beforeUpload}
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

      <Form.Item className={style["submit-button-box"]}>
        <Button
          className={style["submit-button"]}
          type="primary"
          htmlType="submit"
        >
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewLink;