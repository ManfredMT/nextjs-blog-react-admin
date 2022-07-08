import React from "react";
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function TagNav() {
  useRedirect("/manage/tag", "all-tags");
  return <Outlet />;
}

export default TagNav;
