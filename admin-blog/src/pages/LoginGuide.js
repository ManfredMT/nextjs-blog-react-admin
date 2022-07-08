import React from 'react';
import { Link,useNavigate } from "react-router-dom";

function LoginGuide() {
    const navigate = useNavigate();
    const handleCilck=()=>{
        navigate('/')
    }
  return (<>
      <div>请登录</div>
      <button onClick={handleCilck}>点击登录</button>
  </>
    
  )
}

export default LoginGuide