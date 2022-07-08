import React from 'react';
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function LinkNav(props) {
    useRedirect(props.from, "all-links");
    return <Outlet />;
}

export default LinkNav