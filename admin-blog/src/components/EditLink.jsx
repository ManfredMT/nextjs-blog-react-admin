import { Button, Form, message as antMessage } from "antd";
import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import style from "../css/NewLink.module.css";
import { getLinks, reset, updateLink, resetError } from "../features/links/linkSlice";
import HCenterSpin from "./HCenterSpin";
import LinkForm from "./LinkForm";

const EditLink = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { links, isSuccess, isError, message } = useSelector(
    (state) => state.links
  );

  const currentLink = useMemo(()=>links.find((link) => link._id === params.linkId),[links, params]);

  const formRef = useRef(null);

  const [isImgValid, setIsImgValid] = useState(false);

  useEffect(() => {
    dispatch(getLinks());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);


  useEffect(() => {
    if (isError) {
      antMessage.error(message);
    }
    if (isSuccess && message === "友链已更改") {
      antMessage.success(message);
      navigate("../all-links");
    }
    return ()=>{
      dispatch(resetError());
    }
  }, [isError, isSuccess, message, dispatch, navigate]);

  useEffect(() => {
    if (links.length !== 0) {
      const linkIndex = links.findIndex((link) => link._id === params.linkId);
      if (linkIndex === -1) {
        navigate("../all-links");
      }
    }
  }, [links, navigate, params]);

  const onFinish = (values) => {
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
      const imageFile = values.dragger[0].originFileObj;
      linkFormData.append("picture", imageFile);
    }
    dispatch(updateLink(linkFormData));
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
      const imgUrl = currentLink.picture;
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

  const renderForm = (
    <LinkForm
      formRef={formRef}
      formClass={style["new-link-form"]}
      onFinish={onFinish}
      formInit={formInit}
      defaultFileList={getDefaultImg}
      setIsImgValid={setIsImgValid}
    >
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
    </LinkForm>
  );

  return currentLink ? renderForm : <HCenterSpin />;
};

export default EditLink;
