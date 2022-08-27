import { Button, Form, Input, message as antMessage } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import style from "../css/NewForm.module.css";
import { changePasswd, reset } from "../features/auth/authSlice";

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


const ChangePassword = () => {
  const dispatch = useDispatch();
  

  const { isSuccess, isChangePWError, message } = useSelector((state) => state.auth);
  const [isPWMatch, setIsPWMatch] = useState(true);

  const formRef = useRef(null);

  useEffect(() => {
    if (isChangePWError) {
      //console.log(message);
      antMessage.error(message);
    }
    if (isSuccess && message !== "") {
      antMessage.success(message);
      //navigate("/");
    }
    return () => {
      dispatch(reset());
    };
  }, [isChangePWError, isSuccess, message, dispatch]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const onFinish = (values) => {
    if (values.password.new !== values.password.confirm) {
      setIsPWMatch(false);
    } else {
      setIsPWMatch(true);
      const passwordData = {
        origin: values.password.old,
        password: values.password.new,
      };
      dispatch(changePasswd(passwordData));
    }

  };

  return (
    <div className={style["main-box"]}>
      <Form
        ref={formRef}
        className={style["new-form-box"]}
        labelCol={
          isTabletOrMobile
            ? null
            : {
                span: 5,
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
          name={["password", "old"]}
          label={isTabletOrMobile ? null : "原密码"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            className={style["input-password"]}
            placeholder={isTabletOrMobile ? "原密码(必填)" : null}
          />
        </Form.Item>
        <Form.Item
          name={["password", "new"]}
          label={isTabletOrMobile ? null : "新密码"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            className={style["input-password"]}
            placeholder={isTabletOrMobile ? "新密码(必填)" : null}
          />
        </Form.Item>

        <Form.Item
          name={["password", "confirm"]}
          label={isTabletOrMobile ? null : "确认密码"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            className={style["input-password"]}
            placeholder={isTabletOrMobile ? "确认密码(必填)" : null}
          />
        </Form.Item>
        {isPWMatch ? null : (
          <div className={style["warning-info"]}>确认密码和新密码不一致</div>
        )}

        <Form.Item
          className={style["submit-button-box"]}
          wrapperCol={
            isTabletOrMobile
              ? null
              : {
                  span: 24,
                }
          }
        >
          <Button
            className={style["submit-button"]}
            type="primary"
            htmlType="submit"
          >
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
