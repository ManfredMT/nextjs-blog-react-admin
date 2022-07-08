import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset, checkJWT } from "../features/auth/authSlice";

import { Form, Input, Button, Checkbox } from "antd";
import style from "../css/Login.module.css"

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(()=>{
    console.log('user before : ',user)
    dispatch(checkJWT());
    console.log('user after : ',user)
  },[])

  const from = location.state?.from?.pathname || "/manage";

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess) {
      console.log('isSuccess; ',isSuccess);
      console.log('user navigate : ',user)
      //navigate("/manage",{ replace: true });
      navigate(from,{ replace: true });
    }

    
  }, [user, isError, isSuccess, message, navigate, dispatch, from]);


  const onFinish = (values) => {
    //console.log("Success:", values);
    const userDate = {
      password: values.password,
    };
    dispatch(login(userDate));
  };

  const onFinishFailed = (errorInfo) => {
    //console.log("Failed:", errorInfo);
    toast.error(errorInfo);
  };

  return (
    <>
      <div className={style["login-page-box"]}>
      <div className={style["blurred-box"]}>
      
        <Form
          className={style["form-box"]}
          name="basic"
          // labelCol={{
          //   span: 8,
          // }}
          // wrapperCol={{
          //   span: 16,
          // }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        ><div className={style["user-name"]}>Admin</div>
          <Form.Item
            label={<span className={style["label-password"]}>{`密码 :`}</span>}
            name="password"
            colon={false}
            rules={[
              {
                required: true,
                message: "请输入密码!",
              },
            ]}
          >
            <Input.Password className={style["input-password"]} />
          </Form.Item>

          <Form.Item
            // wrapperCol={{
            //   offset: 8,
            //   span: 16,
            // }}
          >
            <button className={style["submit-button"]} type="submit">
              确定
            </button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
