import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import "../css/AdminPanel.css";
import { logout, reset } from "../features/auth/authSlice";

const { Header } = Layout;

function PanelHeader({ setVisible }) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showDrawer = () => {
    setVisible(true);
  };

  //用户下拉菜单点击事件
  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case "change-password":
        navigate("change-password");
        break;
      case "logout":
        dispatch(logout());
        dispatch(reset());
        break;
      default:
        navigate("/manage");
    }
  };

  return (
    <Header
      className="site-layout-sub-header-background"
      //style={{ padding: 0 }}
    >
      {isTabletOrMobile ? (
        <MenuOutlined className="drawer-trigger" onClick={showDrawer} />
      ) : null}

      <Dropdown
        menu={
          {
            items:[
        {
          label: "修改密码",
          key: "change-password",
        },
        {
          label: "退出登录",
          key: "logout",
        },
      ],
      onClick:handleUserMenuClick
          }
        }
        trigger={["click"]}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        <button
          className="no-style-button"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <div className="user-menu-box">
            <Avatar
              style={{
                color: "#457fca",
                backgroundColor: "#d7e9ff",
                marginRight: "0.6rem",
              }}
            >
              A
            </Avatar>
            Admin
            <DownOutlined style={{ fontSize: "12px", marginLeft: "0.1rem" }} />
          </div>
        </button>
      </Dropdown>
    </Header>
  );
}

export default PanelHeader;
