import React from 'react';
import { Outlet } from "react-router-dom";
import useRedirect from "../hooks/useRedirect.js";

function CommentNav() {
    useRedirect("/manage/comment", "recent-comments");
    return <Outlet />;
}

export default CommentNav