import React from 'react';
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function CategoryNav() {
    useRedirect("/manage/category", "all-categories");
    return <Outlet />;
}

export default CategoryNav