import React from "react";
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function PostNav() {
  useRedirect("/manage/post", "all-posts");
  return <Outlet />;
}

export default PostNav;
