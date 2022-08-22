import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

const defaultUploadProps = {
  beforeUpload: (file) => {
    return false;
  },
  maxCount: 1,
  name: "file",
  listType: "picture-card",
  showUploadList: false,
};

function ImageUploadBox({
  imageUrl,
  alt,
  uploadProps = defaultUploadProps,
  onChange = null,
}) {
  return (
    <Upload {...uploadProps} onChange={onChange}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          style={{
            width: "100%",
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}

export default ImageUploadBox;
