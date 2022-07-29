import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  message as antMessage,
  Upload,
  Select,
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
//import {fileTypeFromBuffer} from 'file-type';

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
    profileFormData.append("title", values.site.title);
    profileFormData.append("author", values.site.author);
    profileFormData.append("language", values.site.language);
    profileFormData.append("locate", values.site.locate);
    profileFormData.append("siteUrl", values.site.siteUrl);
    profileFormData.append("siteRepo", values.site.siteRepo);
    if (values.site.keywords.length !== 0) {
      values.site.keywords.forEach((keyword) => {
        profileFormData.append("keywords", keyword);
      });
    } else if (
      profile[0].keywords.length !== 0 &&
      values.site.keywords.length === 0
    ) {
      profileFormData.append("keywords", "");
    }
    if (values.blog.description !== null) {
      profileFormData.append("description", values.blog.description);
    } else if (profile[0]?.description && values.user.description === null) {
      profileFormData.append("description", "");
    }
    if (values.user.email !== null) {
      profileFormData.append("email", values.user.email);
    } else if (profile[0]?.email && values.user.email === null) {
      profileFormData.append("email", "");
    }
    if (values.user.wx !== null) {
      profileFormData.append("wx", values.user.wx);
    } else if (profile[0]?.email && values.user.email === null) {
      profileFormData.append("email", "");
    }
    if (values.user.github !== null) {
      profileFormData.append("github", values.user.github);
    } else if (profile[0]?.github && values.user.github === null) {
      profileFormData.append("github", "");
    }
    if (values.user.zhihu !== null) {
      profileFormData.append("zhihu", values.user.zhihu);
    } else if (profile[0]?.zhihu && values.user.zhihu === null) {
      profileFormData.append("zhihu", "");
    }
    if (values.user.juejin !== null) {
      profileFormData.append("juejin", values.user.juejin);
    } else if (profile[0]?.juejin && values.user.juejin === null) {
      profileFormData.append("juejin", "");
    }

    if (values.upload && imageUrl) {
      const logoFile = values.upload[0].originFileObj;
      profileFormData.append("logo", logoFile);
    }
    if (values.uploadAvatar && imageAvatarUrl) {
      const avatarFile = values.uploadAvatar[0].originFileObj;
      profileFormData.append("avatar", avatarFile);
    }
    if (values.uploadSocialBanner && imageBannerUrl) {
      const bannerFile = values.uploadSocialBanner[0].originFileObj;
      profileFormData.append("socialBanner", bannerFile);
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

  const onFinish = (values) => {
    const formValues = values;
    const profileFormData = getFormDate(formValues);
    profileFormData.append("profileId", profile[0]._id);
    dispatch(updateProfile(profileFormData));
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [imageUrl, setImageUrl] = useState();
  const [imageAvatarUrl, setImageAvatarUrl] = useState();
  const [imageBannerUrl, setImageBannerUrl] = useState();
  const isImgValid = useRef(false);

  const handleChange = (type, info) => {
    console.log("info.file: ", info.file);
    const file = info.file;
    const isLt300k = file.size / 1024 < 300;

    const isPngOrSVGOrICO =
      file.type === "image/png" ||
      file.type === "image/svg+xml" ||
      file.type === "image/x-icon";
    if (!isPngOrSVGOrICO) {
      isImgValid.current = false;
      antMessage.error("只能上传png,svg或icon格式的图片,请重新选择!");
    } else if (!isLt300k) {
      isImgValid.current = false;
      antMessage.error("图片大小必须小于300k,请重新选择!");
    }
    if (isPngOrSVGOrICO && isLt300k) {
      isImgValid.current = true;
      getBase64(info.file, (url) => {
        if (type === "logo") {
          setImageUrl(url);
        }
        if (type === "avatar") {
          setImageAvatarUrl(url);
        }
        if (type === "banner") {
          setImageBannerUrl(url);
        }
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
    //onChange: (info)=>handleChange(,info),
  };

  useEffect(() => {
    if (profile[0]) {
      if (profile[0].logo) {
        const imgArrayBuffer = new Uint8Array(profile[0].logo.data).buffer;
        const blobOptions = profile[0]?.logoType
          ? { type: profile[0].logoType }
          : {};
        const imgBlob = new Blob([imgArrayBuffer], blobOptions);
        // const reader = new FileReader();
        // reader.readAsDataURL(imgBlob);
        // reader.onloadend = () => {
        //   setImageUrl(reader.result);
        // };
        const imgUrl = URL.createObjectURL(imgBlob);
        setImageUrl(imgUrl);
      }
      if (profile[0].avatar) {
        const imgArrayBuffer = new Uint8Array(profile[0].avatar.data).buffer;
        const blobOptions = profile[0]?.avatarType
          ? { type: profile[0].avatarType }
          : {};
        const imgBlob = new Blob([imgArrayBuffer], blobOptions);
        // const reader = new FileReader();
        // reader.readAsDataURL(imgBlob);
        // reader.onloadend = () => {
        //   setImageUrl(reader.result);
        // };
        const imgUrl = URL.createObjectURL(imgBlob);
        setImageAvatarUrl(imgUrl);
      }
      if (profile[0].socialBanner) {
        const imgArrayBuffer = new Uint8Array(profile[0].socialBanner.data)
          .buffer;
        const blobOptions = profile[0]?.socialBannerType
          ? { type: profile[0].socialBannerType }
          : {};
        const imgBlob = new Blob([imgArrayBuffer], blobOptions);
        // const reader = new FileReader();
        // reader.readAsDataURL(imgBlob);
        // reader.onloadend = () => {
        //   setImageUrl(reader.result);
        // };
        const imgUrl = URL.createObjectURL(imgBlob);
        setImageBannerUrl(imgUrl);
      }
    }
  }, [profile]);

  const getDefaultImg = (type) => {
    console.log("profile: ", profile);
    if (!profile[0]) {
      return null;
    }
    let defaultImage;
    if (type === "logo") {
      defaultImage = profile[0].logo;
    }
    if (type === "avatar") {
      defaultImage = profile[0].avatar;
    }
    if (type === "banner") {
      defaultImage = profile[0].socialBanner;
    }
    if (defaultImage) {
      const imgArrayBuffer = new Uint8Array(defaultImage.data).buffer;
      const imgBlob = new Blob([imgArrayBuffer], {
        // type: "image/jpeg"
      });
      const imgUrl = URL.createObjectURL(imgBlob);
      // if(type==='logo') {
      //   setImageUrl(imgUrl);
      // }
      // if(type==='avatar') {
      //   setImageAvatarUrl(imgUrl);
      // }
      // if(type==='banner') {
      //   setImageBannerUrl(imgUrl);
      // }
      return [
        {
          uid: "-1",
          name: type,
          status: "done",
          url: imgUrl,
        },
      ];
    } else {
      return null;
    }
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
        onFinish={onFinish}
      >
        <Divider orientation="left" plain>
          网页
        </Divider>

        <Form.Item
          name={["site", "title"]}
          label="文档标题"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={profile[0] ? profile[0].title : null}
        >
          <Input placeholder={isTabletOrMobile ? "文档标题(必填)" : null} />
        </Form.Item>

        <Form.Item
          name={["site", "author"]}
          label="网页作者"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={profile[0] ? profile[0].author : null}
        >
          <Input placeholder={isTabletOrMobile ? "网页作者(必填)" : null} />
        </Form.Item>

        <Form.Item
          name={["site", "language"]}
          label="网页语言"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={profile[0] ? profile[0].language : null}
        >
          <Input placeholder={isTabletOrMobile ? "网页语言(必填)" : null} />
        </Form.Item>

        <Form.Item
          name={["site", "locale"]}
          label="地区"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={profile[0] ? profile[0].locale : null}
        >
          <Input placeholder={isTabletOrMobile ? "地区(必填)" : null} />
        </Form.Item>

        <Form.Item
          name={["site", "siteUrl"]}
          label="网站URL"
          rules={[
            {
              required: true,
              type: "url",
            },
          ]}
          initialValue={profile[0] ? profile[0].siteUrl : null}
        >
          <Input placeholder={isTabletOrMobile ? "网站URL(必填)" : null} />
        </Form.Item>

        <Form.Item
          name={["site", "siteRepo"]}
          label="仓库地址"
          rules={[
            {
              required: true,
              type: "url",
            },
          ]}
          initialValue={profile[0] ? profile[0].siteRepo : null}
        >
          <Input placeholder={isTabletOrMobile ? "仓库地址(必填)" : null} />
        </Form.Item>

        <Form.Item
          initialValue={profile[0] ? profile[0].keywords ?? null : null}
          name={["site", "keywords"]}
          label="网页关键词"
        >
          <Select
            mode="tags"
            placeholder={isTabletOrMobile ? "网页关键词(可选)" : null}
          ></Select>
        </Form.Item>

        <Form.Item label="社交横幅图">
          <Form.Item
            name="uploadSocialBanner"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload
              {...uploadProps}
              defaultFileList={() => getDefaultImg("banner")}
              onChange={(info) => handleChange("banner", info)}
            >
              {imageBannerUrl ? (
                <img
                  src={imageBannerUrl}
                  alt="social-banner"
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
          博客首页
        </Divider>

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

        <Form.Item label="首页Logo">
          <Form.Item
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload
              {...uploadProps}
              onChange={(info) => handleChange("logo", info)}
              defaultFileList={() => getDefaultImg("logo")}
            >
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

        <Form.Item label="头像">
          <Form.Item
            name="uploadAvatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload
              {...uploadProps}
              defaultFileList={() => getDefaultImg("avatar")}
              onChange={(info) => handleChange("avatar", info)}
            >
              {imageAvatarUrl ? (
                <img
                  src={imageAvatarUrl}
                  alt="avatar"
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
            //onClick={handleUpdateProfile}
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
