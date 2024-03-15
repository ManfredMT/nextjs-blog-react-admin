import {
  BarChartOutlined,
  EditOutlined,
  GroupOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SettingOutlined,
  TagsOutlined,
  CloudOutlined
} from "@ant-design/icons";
import { Drawer, Layout, Menu } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PanelFooter from "../components/PanelFooter";
import PanelHeader from "../components/PanelHeader";
import "../css/AdminPanel.css";
import { ReactComponent as ButterflySvg } from "../images/butterfly-logo.svg";

const { Content, Sider } = Layout;

function AdminPanel() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["dashboard"]);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  //根据当前的URL设置左侧菜单栏的状态
  useEffect(() => {
    const locationSplitPath = location.pathname.split("/");
    const locationItemKey = locationSplitPath[locationSplitPath.length - 1];
    //console.log([locationItemKey]);
    //console.log("locationSplitPath: ", locationSplitPath);
    if (locationSplitPath.length > 3 && !collapsed) {
      setOpenKeys([locationSplitPath[2]]);
    } else if (locationSplitPath.length === 3) {
      //setOpenKeys([]);
    }
    setSelectedKeys([locationItemKey]);
  }, [location, collapsed]);

  //如果用户未登录,跳转到登录页
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate, dispatch]);

  //点击菜单显示对应的菜单页,跳转路由.(二级菜单的点击事件)
  const handleMenuClick = ({ key }) => {
    if (isTabletOrMobile) {
      setVisible(false);
    }
    if (collapsed && !isTabletOrMobile) {
      setOpenKeys([]);
    }

    if (!collapsed && (key === "dashboard" || key === "setting")) {
      setOpenKeys([]);
    }

    switch (key) {
      case "dashboard":
        navigate("dashboard");
        break;
      case "all-posts":
        navigate("post/all-posts");
        break;
      case "new-post":
        navigate("post/new-post");
        break;
      case "all-tags":
        navigate("tag/all-tags");
        break;
      case "post-tags":
        navigate("tag/post-tags");
        break;
      case "all-categories":
        navigate("category/all-categories");
        break;
      case "post-category":
        navigate("category/post-category");
        break;
      case "all-images":
        navigate("media/all-images");
        break;
      case "all-links":
        navigate("link/all-links");
        break;
      case "new-link":
        navigate("link/new-link");
        break;
      case "recent-comments":
        navigate("comment/recent-comments");
        break;
      case "post-comments":
        navigate("comment/post-comments");
        break;
      case "setting":
        navigate("setting");
        break;
      default:
        navigate("/manage");
    }
  };

  //菜单折叠按钮的点击事件
  const toggle = (e) => {
    //e.preventDefault();
    //e.stopPropagation();
    if (!collapsed) {
      setOpenKeys([]);
    }
    setCollapsed(!collapsed);
  };

  //一级菜单的点击事件
  const handleTitleClick = useCallback(
    ({ key }) => {
      // console.log("=================handleTitleClick============");
      // console.log("key: ", key);
      if (collapsed) {
        //菜单折叠状态
        // console.log("collapsed");
        if (openKeys.length === 0 || openKeys[0] !== key) {
          setOpenKeys([key]);
        }
      } else {
        //菜单展开状态
        // console.log("not collapsed");
        if (openKeys.length === 0 || openKeys[0] !== key) {
          setOpenKeys([key]);
        } else if (openKeys[0] === key) {
          setOpenKeys([]);
        }
      }
    },
    [collapsed, openKeys]
  );

  //菜单信息
  const menuItems = useMemo(
    () => [
      {
        label: "统计",
        key: "dashboard",
        icon: <BarChartOutlined />,
      },
      {
        label: "文章管理",
        key: "post",
        icon: <EditOutlined />,
        onTitleClick: handleTitleClick,
        children: [
          { label: "文章列表", key: "all-posts" },
          { label: "发布文章", key: "new-post" },
        ],
      },
      {
        label: "标签管理",
        key: "tag",
        icon: <TagsOutlined />,
        onTitleClick: handleTitleClick,
        children: [
          { label: "标签列表", key: "all-tags" },
          { label: "文章标签", key: "post-tags" },
        ],
      },
      {
        label: "分类管理",
        key: "category",
        icon: <GroupOutlined />,
        onTitleClick: handleTitleClick,
        children: [
          { label: "分类列表", key: "all-categories" },
          { label: "文章分类", key: "post-category" },
        ],
      },
      {
        label: "多媒体",
        key: "media",
        icon: <CloudOutlined />,
        onTitleClick: handleTitleClick,
        children: [
          { label: "图床", key: "all-images" }
        ],
      },
      {
        label: "友链管理",
        key: "link",
        icon: <LinkOutlined />,
        onTitleClick: handleTitleClick,
        children: [
          { label: "友链列表", key: "all-links" },
          { label: "添加友链", key: "new-link" },
        ],
      },
      {
        label: "评论管理",
        key: "comment",
        icon: <MessageOutlined />,
        onTitleClick: handleTitleClick,
        children: [
          { label: "查看最近评论", key: "recent-comments" },
          { label: "查看文章评论", key: "post-comments" },
        ],
      },

      {
        label: "博客设置",
        key: "setting",
        icon: <SettingOutlined />,
      },
    ],
    [handleTitleClick]
  );

  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  //移动端UI
  const renderMobile = (
    <>
      <Drawer
        placement="left"
        onClose={onClose}
        open={visible}
        closable={false}
        width="60vw"
        styles={{ body: { padding: 0, backgroundColor: "#001529" } }}
      >
        <Menu
          theme="dark"
          mode="inline"
          //style={{margin:0}}
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          //onSelect={handleMenuSelect}
          onClick={handleMenuClick}
        />
      </Drawer>
    </>
  );

  //桌面端UI
  const renderDesktop = (
    <>
      <Sider
        //breakpoint="lg"
        //collapsedWidth="0"
        className="side-box"
        collapsible
        trigger={null}
        collapsed={collapsed}
        //onCollapse={onCollapse}
        onBreakpoint={(broken) => {
          // console.log('***********broken: ',broken);
          setOpenKeys([]);
          setCollapsed(broken);
        }}
      >
        <div className="logo">
          <ButterflySvg
            className="logo-svg"
            height={32}
            width={collapsed ? 48 : 168}
          ></ButterflySvg>
        </div>
        <Menu
          className="menu-box"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          //onSelect={handleMenuSelect}
          onClick={handleMenuClick}
        />
        <button
          className="menu-fold-button"
          //onClick={(e) => e.preventDefault()}
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={toggle} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={toggle} />
          )}
        </button>
      </Sider>
    </>
  );

  return (
    <>
      <Layout
        className="admin-panel-layout"
        style={
          isTabletOrMobile
            ? { minHeight: "-webkit-fill-available" }
            : { minHeight: "100vh" }
        }
      >
        {isTabletOrMobile ? renderMobile : renderDesktop}
        <Layout>
          <PanelHeader setVisible={setVisible} />
          <Content
            style={
              isTabletOrMobile ? { margin: "12px 0px" } : { margin: "24px 0px" }
            }
          >
            <div
              className="site-layout-background"
              style={{ padding: 0, minHeight: 360 }}
            >
              <Outlet />
            </div>
          </Content>
          <PanelFooter />
        </Layout>
      </Layout>
    </>
  );
}

export default AdminPanel;
