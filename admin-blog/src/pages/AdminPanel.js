import {
  BarChartOutlined,
  SettingOutlined, DownOutlined,
  EditOutlined, GroupOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SearchOutlined,
  TagsOutlined
} from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../css/AdminPanel.css";
import { logout, reset } from "../features/auth/authSlice";

const { Header, Content, Footer, Sider } = Layout;

function AdminPanel() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["dashboard"]);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isSuccess } = useSelector((state) => state.auth);

  //console.log("location: ", location);

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

  const handleClick = (e) => {
    dispatch(logout());
    dispatch(reset());
    console.log("removing user : ", user);
  };

  //点击菜单显示对应的菜单页,二级菜单的点击事件
  const handleMenuClick = ({ item, key, keyPath, domEvent }) => {
    // console.log("=================click===============================");
    // console.log("item; ", item);
    // console.log("key: ", key);
    // console.log("keyPath: ", keyPath);

    // console.log("domEvent: ", domEvent);
    if (isTabletOrMobile) {
      setVisible(false);
    }
    if (collapsed && !isTabletOrMobile) {
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
      case "seo":
        navigate("seo");
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

  //双击事件,测试使用,可删除
  const handleDbClick = (e) => {
    console.log("dbclick");
  };

  //一级菜单的点击事件
  const handleTitleClick = ({ key, domEvent }) => {
    // console.log("=================handleTitleClick============");
    // console.log("key: ", key);
    if (collapsed) {
      //console.log("collapsed");
      if (openKeys === [] || openKeys[0] !== key) {
        setOpenKeys([key]);
      }
    } else {
      //console.log("not collapsed");
      if (openKeys === [] || openKeys[0] !== key) {
        setOpenKeys([key]);
      } else if (openKeys[0] === key) {
        setOpenKeys([]);
      }
    }

    //console.log("=================handleTitleClick============");
  };

  //菜单信息
  const menuItems = [
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
      label: "SEO",
      key: "seo",
      icon: <SearchOutlined />,
    },
    {
      label: "博客设置",
      key: "setting",
      icon: <SettingOutlined />,
    },
  ];

  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  //移动端UI
  const renderMobile = (
    <>
      <Drawer
        placement="left"
        onClose={onClose}
        visible={visible}
        closable={false}
        width="60vw"
        bodyStyle={{ padding: 0, backgroundColor: "#001529" }}
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
        collapsible
        trigger={null}
        collapsed={collapsed}
        //onCollapse={onCollapse}
        onBreakpoint={(broken) => {
          // console.log('***********broken: ',broken);
          setOpenKeys([]);
          setCollapsed(broken);
        }}
        onDoubleClick={handleDbClick}
      >
        <div className="logo" />
        <Menu
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
            <MenuUnfoldOutlined
              className="trigger"
              onClick={toggle}
              onDoubleClick={handleDbClick}
            />
          ) : (
            <MenuFoldOutlined
              className="trigger"
              onClick={toggle}
              onDoubleClick={handleDbClick}
            />
          )}
        </button>
      </Sider>
    </>
  );

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



  //用户下拉菜单
  const userMenu = (
    <Menu
      items={[
        {
          label: "修改密码",
          key: "change-password",
        },
        {
          label: "退出登录",
          key: "logout",
        },
      ]}
      onClick={handleUserMenuClick}
    />
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
            <Header
              className="site-layout-sub-header-background"
              //style={{ padding: 0 }}
            >
              {isTabletOrMobile ? (
                <MenuOutlined className="drawer-trigger" onClick={showDrawer} />
              ) : null}

              {/* {handle.active ? (
                <button className="no-style-button" onClick={handle.exit}>
                  <CompressOutlined className="exit-full-screen-button" />
                </button>
              ) : (
                <button className="no-style-button" onClick={handle.enter}>
                  <ExpandOutlined className="full-screen-button" />
                </button>
              )} */}

              <Dropdown
                overlay={userMenu}
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
                    <DownOutlined
                      style={{ fontSize: "12px", marginLeft: "0.1rem" }}
                    />
                  </div>
                </button>
              </Dropdown>
            </Header>
            <Content
              style={
                isTabletOrMobile
                  ? { margin: "12px 0px" }
                  : { margin: "24px 0px" }
              }
            >
              <div
                className="site-layout-background"
                style={{ padding: 0, minHeight: 360 }}
              >
                <Outlet />
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Blog Admin ©2022 Created by manfred
            </Footer>
          </Layout>
        </Layout>
     
    </>
  );
}

export default AdminPanel;
