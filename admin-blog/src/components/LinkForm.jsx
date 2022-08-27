import { InboxOutlined } from "@ant-design/icons";
import { Form, Input, message as antMessage, Modal, Upload } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const validateMessages = {
  // eslint-disable-next-line
  required: "${label}不能为空!",
  types: {
    // eslint-disable-next-line
    url: "${label}不是有效的链接!",
  },
  number: {
    // eslint-disable-next-line
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

function LinkForm({
  formRef,
  formClass,
  onFinish,
  formInit,
  defaultFileList,
  setIsImgValid,
  children,
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleImageUpload = (e) => {
    const file = e.file;
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      setIsImgValid(false);
      antMessage.error("只能上传jpeg或者png格式的图片,请重新选择!");
      setTimeout(() => {
        e.onError("file type error");
      }, 0);
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      setIsImgValid(false);
      antMessage.error("图片大小必须小于1MB,请重新选择!");
      setTimeout(() => {
        e.onError("file size error");
      }, 0);
    }
    if (isJpgOrPng && isLt1M) {
      setIsImgValid(true);
      setTimeout(() => {
        e.onSuccess("ok");
      }, 0);
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

  const onFinishFailed = () => {
    antMessage.error("表单错误，请修改表单");
  };

  return (
    <Form
      ref={formRef}
      className={formClass}
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
      onFinishFailed={onFinishFailed}
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
        <Input
          onPressEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          placeholder={isTabletOrMobile ? "友链名称(必填)" : null}
        />
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
        <Input
          onPressEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          placeholder={isTabletOrMobile ? "友链网址(必填)" : null}
        />
      </Form.Item>

      <Form.Item name={["link", "introduction"]} label="网站介绍">
        <Input.TextArea
          onPressEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
            customRequest={handleImageUpload}
            defaultFileList={defaultFileList}
            onPreview={handlePreview}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传图片</p>
            <p className="ant-upload-hint">
              支持jpeg和png格式,文件大小上限为1M.
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
      {children}
    </Form>
  );
}

export default LinkForm;
