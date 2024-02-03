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
} from "@ant-design/icons";
import { Drawer, Layout, Menu } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PanelFooter from "../components/PanelFooter";
import PanelHeader from "../components/PanelHeader";
import "../css/AdminPanel.css";

const { Content, Sider } = Layout;

function AdminPanel() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["dashboard"]);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user,} = useSelector((state) => state.auth);

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
        styles={{body: {padding: 0, backgroundColor: "#001529"} }}
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
          <svg
            className="logo-svg"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            height={32}
            width={collapsed ? 48 : 168}
          >
            <path
              style={{ fill: "#73BEFF" }}
              d="M264.551,277.377l7.48,52.363c1.038,7.266,2.823,14.415,5.611,21.206
	c6.577,16.023,21.851,43.911,55.318,71.801c13.33,11.109,20.738,28.285,23.86,37.105c1.209,3.415,4.415,5.651,8.037,5.651h13.113
	c3.676,0,6.908-2.342,8.101-5.82c3.95-11.513,15.155-38.895,40.951-71.14c26.71-33.387,54.514-97.269-22.447-131.474
	l-137.887-12.827L264.551,277.377z"
            />
            <path
              style={{ fill: "#64A0F0" }}
              d="M404.576,257.068c16.12,7.165,27.592,15.641,35.493,24.857
	c-42.148,5.517-116.785,5.862-175.324-3.186l-0.195-1.361l2.138-33.136L404.576,257.068z"
            />
            <path
              style={{ fill: "#73BEFF" }}
              d="M469.779,46.496c17.102,0,34.205,6.777,34.205,25.653c0,25.653-17.102,153.921-51.307,179.574
	c-24.666,18.499-188.125,0-188.125,0v-17.102C264.551,234.621,392.818,46.496,469.779,46.496z"
            />
            <path
              style={{ fill: "#594759" }}
              d="M265.429,242.103c21.738,53.065,57.75,132.718,85.87,193.896
	c-51.808-39.844-68.175-71.466-74.191-86.122c-2.787-6.791-4.572-13.939-5.611-21.206l-7.48-52.364L265.429,242.103z"
            />
            <path
              style={{ fill: "#463246" }}
              d="M469.779,46.496c17.102,0,34.205,6.777,34.205,25.653c0,5.805-0.885,16.893-2.637,30.827
	c-15.536-11.082-98.093-16.524-171.798,47.63C372.618,100.475,428.551,46.496,469.779,46.496z"
            />
            <g>
              <path
                style={{ fill: "#64A0F0" }}
                d="M469.779,46.496c17.102,0,34.205,6.777,34.205,25.653c0,9.302-2.261,32.112-6.757,58.61
		c-26.826-10.873-83.486-9.905-198.022,56.962C342.697,132.003,417.879,46.496,469.779,46.496z"
              />
              <path
                style={{ fill: "#64A0F0" }}
                d="M490.414,165.178c-1.301,5.685-2.688,11.35-4.174,16.921c-30.088-2.189-75.51-3.109-123.408,4.665
		l-2.74-16.877C411.641,161.506,459.539,162.738,490.414,165.178z"
              />
              <path
                style={{ fill: "#64A0F0" }}
                d="M465.185,236.865c-32.565-7.228-88.675-17.684-148.191-19.705l0.585-17.094
		c63.411,2.155,123.017,13.67,155.581,21.069C470.654,226.942,467.996,232.24,465.185,236.865z"
              />
            </g>
            <path
              style={{ fill: "#73BEFF" }}
              d="M247.449,277.377l-7.48,52.363c-1.038,7.266-2.823,14.415-5.611,21.206
	c-6.577,16.023-21.851,43.911-55.318,71.801c-13.33,11.109-20.738,28.285-23.86,37.105c-1.209,3.415-4.415,5.651-8.037,5.651H134.03
	c-3.676,0-6.908-2.342-8.101-5.82c-3.95-11.513-15.155-38.895-40.951-71.14c-26.71-33.387-54.514-97.269,22.447-131.474
	l137.887-12.827L247.449,277.377z"
            />
            <path
              style={{ fill: "#64A0F0" }}
              d="M107.424,257.068c-16.12,7.165-27.592,15.641-35.493,24.857
	c42.148,5.517,116.785,5.862,175.324-3.186l0.195-1.361l-2.138-33.136L107.424,257.068z"
            />
            <path
              style={{ fill: "#73BEFF" }}
              d="M42.221,46.496c-17.102,0-34.205,6.777-34.205,25.653c0,25.653,17.102,153.921,51.307,179.574
	c24.666,18.499,188.125,0,188.125,0v-17.102C247.449,234.621,119.182,46.496,42.221,46.496z"
            />
            <path
              style={{ fill: "#594759" }}
              d="M246.571,242.103c-21.738,53.065-57.75,132.718-85.87,193.896
	c51.808-39.844,68.175-71.466,74.191-86.122c2.787-6.791,4.572-13.939,5.611-21.206l7.48-52.364L246.571,242.103z"
            />
            <g>
              <path
                style={{ fill: "#463246" }}
                d="M256,277.377L256,277.377c-9.446,0-17.102-7.656-17.102-17.102v-25.653
		c0-9.446,7.656-17.102,17.102-17.102l0,0c9.446,0,17.102,7.656,17.102,17.102v25.653C273.102,269.72,265.446,277.377,256,277.377z"
              />
              <path
                style={{ fill: "#463246" }}
                d="M42.221,46.496c-17.102,0-34.205,6.777-34.205,25.653c0,5.805,0.885,16.893,2.637,30.827
		c15.536-11.082,98.093-16.524,171.798,47.63C139.382,100.475,83.449,46.496,42.221,46.496z"
              />
            </g>
            <g>
              <path
                style={{ fill: "#64A0F0" }}
                d="M42.221,46.496c-17.102,0-34.205,6.777-34.205,25.653c0,9.302,2.261,32.112,6.756,58.61
		c26.826-10.873,83.486-9.905,198.022,56.962C169.303,132.003,94.121,46.496,42.221,46.496z"
              />
              <path
                style={{ fill: "#64A0F0" }}
                d="M21.586,165.178c1.301,5.685,2.688,11.35,4.174,16.921c30.088-2.189,75.51-3.109,123.408,4.665
		l2.74-16.877C100.359,161.506,52.461,162.738,21.586,165.178z"
              />
              <path
                style={{ fill: "#64A0F0" }}
                d="M46.815,236.865c32.565-7.228,88.675-17.684,148.191-19.705l-0.585-17.094
		c-63.411,2.155-123.017,13.67-155.581,21.069C41.346,226.942,44.004,232.24,46.815,236.865z"
              />
            </g>
            <path
              d="M498.982,163.675C507.476,125.453,512,85.961,512,72.149c0-20.454-16.573-33.67-42.221-33.67
	c-34.32,0-79.14,31.123-133.213,92.504c-26.721,30.332-49.278,60.947-61.149,77.688l13.946-48.809
	c1.216-4.257-1.248-8.694-5.506-9.911c-4.254-1.215-8.693,1.248-9.911,5.506l-15.477,54.166c-0.812-0.08-1.636-0.123-2.469-0.123
	c-0.833,0-1.657,0.043-2.469,0.123l-15.477-54.166c-1.216-4.257-5.653-6.723-9.911-5.506c-4.256,1.216-6.722,5.653-5.506,9.911
	l13.946,48.809c-11.87-16.742-34.428-47.356-61.149-77.688C121.361,69.602,76.541,38.479,42.221,38.479
	C16.573,38.479,0,51.695,0,72.149c0,13.812,4.524,53.304,13.018,91.526c11.207,50.435,25.169,82.216,41.496,94.461
	c3.458,2.593,9.292,5.47,21.861,7.44c-15.059,10.797-24.526,23.864-28.223,39.043c-7.828,32.137,12.301,66.098,30.566,88.93
	c25.36,31.698,36.162,58.628,39.628,68.734c2.306,6.72,8.609,11.235,15.684,11.235h13.075c0.011,0,0.022,0.002,0.034,0.002
	c0.017,0,0.034-0.003,0.051-0.004c6.981-0.019,13.225-4.431,15.548-10.99c2.954-8.348,9.668-23.816,21.433-33.621
	c33.733-28.111,49.944-56.255,57.603-74.916c2.877-7.013,4.94-14.789,6.13-23.116l6.505-45.536c0.527,0.033,1.056,0.056,1.591,0.056
	c0.534,0,1.064-0.022,1.591-0.056l6.505,45.536c1.19,8.327,3.252,16.103,6.13,23.116c7.66,18.661,23.871,46.805,57.603,74.916
	c11.765,9.805,18.479,25.274,21.435,33.622c2.323,6.56,8.567,10.97,15.547,10.989c0.017,0,0.034,0.004,0.052,0.004
	c0.011,0,0.022-0.002,0.034-0.002h13.075c7.076,0,13.378-4.515,15.684-11.235c3.467-10.106,14.27-37.035,39.628-68.734
	c18.264-22.831,38.394-56.792,30.566-88.93c-3.697-15.18-13.166-28.248-28.224-39.045c12.569-1.971,18.405-4.846,21.862-7.44
	C473.813,245.891,487.775,214.11,498.982,163.675z M495.967,72.149c0,3.999-0.359,9.863-1.059,17.048
	c-15.965-2.836-56.27-5.368-117.577,21.787c46.326-45.845,75.436-56.472,92.449-56.472
	C493.415,54.513,495.967,66.846,495.967,72.149z M345.201,145.464c22.054-12.807,52.71-27.975,85.38-36.089
	c-58.735,55.36-112.84,90.412-140.906,106.904C301.044,200.318,321.241,173.045,345.201,145.464z M166.803,145.468
	c23.951,27.572,44.161,54.864,55.532,70.828c-28.053-16.474-82.153-51.512-140.982-106.981
	C104.294,114.992,132.902,125.776,166.803,145.468z M42.221,54.513c17.009,0,46.118,10.624,92.448,56.472
	C73.361,83.829,33.058,86.361,17.093,89.198c-0.7-7.185-1.059-13.05-1.059-17.049C16.033,66.846,18.585,54.513,42.221,54.513z
	 M18.942,105.152c5.78-1.115,17.311-2.511,34.249-0.814c82.661,82.427,158.62,125.119,177.69,135.175v5.045
	c-13.034,1.422-42.347,4.406-73.036,6.101c-74.823,4.133-90.644-3.051-93.711-5.35C41.151,228.073,25.176,152.434,18.942,105.152z
	 M63.73,308.415c4.016-16.491,17.855-30.141,41.11-40.584c3.647,0.096,7.55,0.149,11.745,0.149c11.702,0,25.625-0.397,42.218-1.314
	c14.8-0.819,29.272-1.933,41.804-3.03L65.39,338.003C61.615,325.401,61.981,315.592,63.73,308.415z M71.343,352.996
	c0.131-0.064,0.265-0.114,0.394-0.186l138.423-76.133l-99.978,133.304c-5.26-8.273-11.515-17.158-18.946-26.448
	C82.197,372.234,75.786,362.068,71.343,352.996z M133.511,457.081c-2.472-7.208-6.937-18.388-14.488-32.165L220.11,290.134
	l-78.073,167.351h-8.007C133.75,457.485,133.579,457.277,133.511,457.081z M226.941,347.902
	c-5.201,12.671-17.698,36.566-44.746,61.428l55.212-118.346l-5.374,37.622C231.03,335.622,229.317,342.113,226.941,347.902z
	 M246.914,260.275v-25.653c0-5.01,4.076-9.086,9.086-9.086c5.01,0,9.086,4.076,9.086,9.086v25.653c0,5.01-4.076,9.086-9.086,9.086
	C250.99,269.36,246.914,265.284,246.914,260.275z M285.059,347.902c-2.376-5.788-4.089-12.279-5.09-19.296l-5.374-37.622
	l55.212,118.346C302.756,384.468,290.259,360.573,285.059,347.902z M378.489,457.08c-0.067,0.197-0.238,0.405-0.518,0.405h-8.007
	L291.89,290.134l101.086,134.782C385.425,438.692,380.961,449.874,378.489,457.08z M420.764,383.533
	c-7.431,9.29-13.687,18.174-18.946,26.448L301.84,276.677l138.423,76.133c0.129,0.071,0.263,0.122,0.394,0.185
	C436.214,362.068,429.803,372.234,420.764,383.533z M448.27,308.415c1.749,7.178,2.114,16.986-1.66,29.589l-135.217-74.369
	c12.533,1.098,27.005,2.213,41.804,3.03c16.598,0.918,30.514,1.314,42.218,1.314c4.195,0,8.098-0.052,11.745-0.149
	C430.416,278.274,444.254,291.923,448.27,308.415z M447.866,245.31c-3.067,2.299-18.891,9.483-93.711,5.35
	c-30.689-1.694-60.002-4.68-73.036-6.101v-5.045c19.067-10.054,95-52.733,177.643-135.13c16.854-1.691,28.457-0.308,34.293,0.796
	C486.818,152.464,470.844,228.076,447.866,245.31z"
            />
          </svg>
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
            <MenuUnfoldOutlined
              className="trigger"
              onClick={toggle}
         
            />
          ) : (
            <MenuFoldOutlined
              className="trigger"
              onClick={toggle}
             
            />
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
