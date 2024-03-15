import React from 'react';
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function MediaNav(props) {
    useRedirect(props.from, "all-images");
    return <Outlet />;
}

export default MediaNav