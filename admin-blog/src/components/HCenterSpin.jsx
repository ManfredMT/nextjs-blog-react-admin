import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import style from "../css/HCenterSpin.module.css";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

function HCenterSpin() {
  return <Spin className={style["spin-center"]} indicator={antIcon} />;
}

export default HCenterSpin;
