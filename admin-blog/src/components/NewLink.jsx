import { Button, Form, message as antMessage } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../css/NewLink.module.css";
import { createLink, resetError } from "../features/links/linkSlice";
import LinkForm from "./LinkForm";

const NewLink = () => {
  const dispatch = useDispatch();

  const { isSuccess, isError, message } = useSelector((state) => state.links);

  const formRef = useRef(null);

  const [isImgValid, setIsImgValid] = useState(false);

  useEffect(() => {
    if (isError) {
      antMessage.error(message);
    }
    if (isSuccess && message === "成功创建友链") {
      antMessage.success(message);
      formRef.current.resetFields();
    }
    return () => {
      dispatch(resetError());
    };
  }, [isError, isSuccess, message, dispatch]);

  const onFinish = (values) => {
    //console.log(values);
    const linkFormData = new FormData();
    linkFormData.append("name", values.link.name);
    linkFormData.append("website", values.link.address);
    if (values.link.introduction) {
      linkFormData.append("description", values.link.introduction);
    }
    if (values.dragger && isImgValid) {
      //console.log("uploaded image: ", values.dragger[0].originFileObj);
      const imageFile = values.dragger[0].originFileObj;
      linkFormData.append("picture", imageFile);
    }
    dispatch(createLink(linkFormData));
  };

  return (
    <LinkForm
    formRef={formRef}
    formClass={style["new-link-form"]}
    onFinish={onFinish}
    formInit={null}
    defaultFileList={null}
    setIsImgValid={setIsImgValid}
    >
       <Form.Item className={style["submit-button-box"]}>
        <Button
          className={style["submit-button"]}
          type="primary"
          htmlType="submit"
        >
          确认
        </Button>
      </Form.Item>
    </LinkForm>
  );
};

export default NewLink;
