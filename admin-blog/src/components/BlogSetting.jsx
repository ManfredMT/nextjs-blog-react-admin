import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  message as antMessage,
  Upload,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/BlogSetting.module.css";
import {
  getProfile,
  reset,
  updateProfile,
} from "../features/profile/profileSlice";
import usePrevious from "../hooks/usePrevious";
import HCenterSpin from "./HCenterSpin";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

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

function BlogSetting() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();
  const { profile, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.profile
  );
  const preIsSuccess = usePrevious(isSuccess);
  useEffect(() => {
    dispatch(getProfile());
    return () => {
      dispatch(reset());
    };
  }, []);

  let isErrorReset = useRef(false);
  useEffect(() => {
    if (!isError) {
      isErrorReset.current = true;
    }
    if (isErrorReset.current && isError) {
      antMessage.error(message);
    }
  }, [isError, message]);

  useEffect(() => {
    if (isSuccess && message === "设置已更改") {
      antMessage.success(message);
      dispatch(getProfile());
    }
  }, [isSuccess, message]);

  // console.log("const preIsSuccess; ",preIsSuccess);
  // console.log("isSuccess: ",isSuccess);
  // console.log("profile: ",profile);

  const validateMessages = {
    required: "${label}不能为空!",
    types: {
      url: "${label}不是有效的链接!",
      email: "${label}不是有效的邮件格式!",
    },
  };

  const formRef = useRef(null);

  function getFormDate(values) {
    console.log("values: ", values);
    const profileFormData = new FormData();
    profileFormData.append("name", values.blog.name);
    if (values.blog.description !== null) {
      profileFormData.append("description", values.blog.description);
    }
    if (values.user.email !== null) {
      profileFormData.append("email", values.user.email);
    }
    if (values.user.wx !== null) {
      profileFormData.append("wx", values.user.wx);
    }
    if (values.user.github !== null) {
      profileFormData.append("github", values.user.github);
    }
    if (values.user.zhihu !== null) {
      profileFormData.append("zhihu", values.user.zhihu);
    }
    if (values.user.juejin !== null) {
      profileFormData.append("juejin", values.user.juejin);
    }
    if (values.upload && isImgValid.current) {
      const logoFile = values.upload[0].originFileObj;
      profileFormData.append("logo", logoFile);
    }
    return profileFormData;
  }

  const handleUpdateProfile = (e) => {
    const formValues = formRef.current.getFieldsValue(true);
    const profileFormData = getFormDate(formValues);
    profileFormData.append("profileId", profile[0]._id);
    dispatch(updateProfile(profileFormData));
    //console.log("profileFormData: ",profileFormData);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  
  const [imageUrl, setImageUrl] = useState();
  const isImgValid = useRef(false);

  const handleChange = (info) => {
    console.log("info.file: ", info.file);
    const file = info.file;
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      isImgValid.current = false;
      antMessage.error("图片大小必须小于1MB,请重新选择!");
    }
    const isPngOrSVGOrICO =
      file.type === "image/png" ||
      file.type === "image/svg+xml" ||
      file.type === "image/x-icon";
    if (!isPngOrSVGOrICO) {
      isImgValid.current = false;
      antMessage.error("只能上传png格式的图片,请重新选择!");
    }
    if (isPngOrSVGOrICO && isLt1M) {
      isImgValid.current = true;
      getBase64(info.file, (url) => {
        setImageUrl(url);
      });
    }
  };

  //console.log("debug fileList: ",fileList);
  const uploadProps = {
    beforeUpload: (file) => {
      return false;
    },
    //fileList,
    maxCount: 1,
    name: "file",
    listType: "picture-card",
    showUploadList: false,
    onChange: handleChange,

  };

  return profile[0] !== undefined ? (
    <div className={style["main-box"]}>
      <Form
        ref={formRef}
        labelCol={
          isTabletOrMobile
            ? null
            : {
                span: 2,
              }
        }
        wrapperCol={
          isTabletOrMobile
            ? null
            : {
                span: 21,
              }
        }
        layout={isTabletOrMobile ? "vertical" : null}
        name="nest-messages"
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["blog", "name"]}
          label="博客名字"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={profile[0] ? profile[0].name : null}
        >
          <Input placeholder={isTabletOrMobile ? "博客名字(必填)" : null} />
        </Form.Item>

        <Form.Item
          initialValue={profile[0]?.description ?? null}
          name={["blog", "description"]}
          label="博客简介"
        >
          <Input.TextArea
            placeholder={isTabletOrMobile ? "博客简介(可选)" : null}
            autoSize={{ minRows: 2 }}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item label="网站Logo">
          <Form.Item
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload {...uploadProps}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="blog-logo"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
             
            </Upload>
          </Form.Item>
        </Form.Item>

        <Divider orientation="left" plain>
          平台信息
        </Divider>

        <Form.Item
          name={["user", "email"]}
          label="邮箱"
          rules={[
            {
              type: "email",
            },
          ]}
          initialValue={profile[0]?.email ?? null}
        >
          <Input placeholder={isTabletOrMobile ? "邮箱(可选)" : null} />
        </Form.Item>

        <Form.Item
          name={["user", "github"]}
          label="github"
          rules={[
            {
              type: "url",
            },
          ]}
          initialValue={profile[0]?.github ?? null}
        >
          <Input placeholder={isTabletOrMobile ? "github(可选)" : null} />
        </Form.Item>

        <Form.Item
          name={["user", "zhihu"]}
          label="知乎"
          rules={[
            {
              type: "url",
            },
          ]}
          initialValue={profile[0]?.zhihu ?? null}
        >
          <Input placeholder={isTabletOrMobile ? "知乎(可选)" : null} />
        </Form.Item>

        <Form.Item
          name={["user", "juejin"]}
          label="稀土掘金"
          rules={[
            {
              type: "url",
            },
          ]}
          initialValue={profile[0]?.juejin ?? null}
        >
          <Input placeholder={isTabletOrMobile ? "稀土掘金(可选)" : null} />
        </Form.Item>

        <Form.Item
          name={["user", "wx"]}
          label="微信"
          initialValue={profile[0]?.wx ?? null}
        >
          <Input placeholder={isTabletOrMobile ? "微信(可选)" : null} />
        </Form.Item>

        <Form.Item
          //className={style["submit-button-box"]}
          wrapperCol={
            isTabletOrMobile
              ? { span: 12, offset: 8 }
              : { span: 12, offset: 10 }
          }
        >
          <Button
            //className={style["submit-button"]}
            type="primary"
            htmlType="submit"
            onClick={handleUpdateProfile}
          >
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <HCenterSpin />
  );
}

export default BlogSetting;
