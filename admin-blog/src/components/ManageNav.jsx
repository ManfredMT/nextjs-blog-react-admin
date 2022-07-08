import React from 'react';
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function ManageNav() {
    useRedirect("/manage", "dashboard");
    return <Outlet />;
}

export default ManageNav