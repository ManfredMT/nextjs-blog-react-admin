import {
  Button,
  Divider,
  Form,
  Input,
  message as antMessage
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/BlogSetting.module.css";
import {
  getProfile,
  reset,
  updateProfile,
  resetError
} from "../features/profile/profileSlice";
import useGetData from "../hooks/useGetData";
import HCenterSpin from "./HCenterSpin";
import ImageUploadBox from "./ImageUploadBox";


const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

function BlogSetting() {
  const [imageUrl, setImageUrl] = useState();
  const [imageAvatarUrl, setImageAvatarUrl] = useState();
  const [imageBannerUrl, setImageBannerUrl] = useState();
  const isImgValid = useRef(false);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();
  const { profile, isSuccess, isError, message } = useSelector(
    (state) => state.profile
  );
  useGetData(getProfile, reset, isError, message, resetError);
  useEffect(() => {
    if (isSuccess && message === "设置已更改") {
      antMessage.success(message);
      dispatch(getProfile());
    }
  }, [isSuccess, message, dispatch]);

  //antd为什么要用这种奇怪的写法?
  const validateMessages = {
    // eslint-disable-next-line
    required: "${label}不能为空!",
    types: {
      // eslint-disable-next-line
      url: "${label}不是有效的链接!",
      // eslint-disable-next-line
      email: "${label}不是有效的邮件格式!",
    },
  };

  const formRef = useRef(null);

  const getFormDate = useCallback(
    (values) => {
      //console.log("values: ", values);
      const profileFormData = new FormData();
      profileFormData.append("name", values.blog.name);
      profileFormData.append("title", values.site.title);
      profileFormData.append("author", values.site.author);
      profileFormData.append("language", values.site.language);
      profileFormData.append("locate", values.site.locate);
      profileFormData.append("siteUrl", values.site.siteUrl);
      profileFormData.append("siteRepo", values.site.siteRepo);
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
    },
    [imageAvatarUrl, imageUrl, imageBannerUrl, profile]
  );

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

  const handleChange = (type, info) => {
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

  useEffect(() => {
    if (profile[0]) {
      if (profile[0].logo) {
        setImageUrl(profile[0].logo);
      }
      if (profile[0].avatar) {
        setImageAvatarUrl(profile[0].avatar);
      }
      if (profile[0].socialBanner) {
        setImageBannerUrl(profile[0].socialBanner);
      }
    }
  }, [profile]);

  const onFinishFailed=()=>{
    antMessage.error("表单错误，请修改表单")
  }

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
        onFinishFailed={onFinishFailed}
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
        label="社交横幅图" 
        tooltip="建议尺寸1200*630,最小尺寸200*200,支持png,svg,icon格式，最大300KB,建议使用png格式."
        >
          <Form.Item
            name="uploadSocialBanner"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <ImageUploadBox
              onChange={(info) => handleChange("banner", info)}
              imageUrl={imageBannerUrl}
              alt="social-banner"
            />
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
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            placeholder={isTabletOrMobile ? "博客简介(必填)" : null}
            autoSize={{ minRows: 2 }}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item label="首页Logo" tooltip="支持png,svg,icon格式，最大300KB,建议使用无背景图片">
          <Form.Item
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <ImageUploadBox
              onChange={(info) => handleChange("logo", info)}
              imageUrl={imageUrl}
              alt="blog-logo"
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="头像" tooltip="支持png,svg,icon格式，最大300KB,建议使用png格式">
          <Form.Item
            name="uploadAvatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <ImageUploadBox
              onChange={(info) => handleChange("avatar", info)}
              imageUrl={imageAvatarUrl}
              alt="avatar"
            />
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
              required: true,
              type: "email",
            },
          ]}
          initialValue={profile[0]?.email ?? null}
        >
          <Input placeholder={isTabletOrMobile ? "邮箱(必填)" : null} />
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
          <Input placeholder={"https://github.com/xxx (可选)"} />
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
          <Input placeholder={"https://www.zhihu.com/people/xxx (可选)"} />
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
          <Input placeholder={"https://juejin.cn/user/xxx 稀土掘金(可选)"} />
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
