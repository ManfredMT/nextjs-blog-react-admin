import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.less";
import AllCategories from "./components/AllCategories";
import AllLinks from "./components/AllLinks";
import AllPosts from "./components/AllPosts.jsx";
import AllTags from "./components/AllTags";
import BlogDashboard from "./components/BlogDashboard";
import CategoryNav from "./components/CategoryNav";
import ChangePassword from "./components/ChangePassword";
import CommentNav from "./components/CommentNav";
import EditLink from "./components/EditLink";
import LinkNav from "./components/LinkNav.jsx";
import ManageNav from "./components/ManageNav";
import NewLink from "./components/NewLink";
import NewPost from "./components/NewPost.jsx";
import PostCategory from "./components/PostCategory";
import PostComments from "./components/PostComments";
import PostNav from "./components/PostNav";
import PostTags from "./components/PostTags";
import RecentComments from "./components/RecentComments";
import RequireAuth from "./components/RequireAuth.jsx";
import SEOSetting from "./components/SEOSetting";
import TagNav from "./components/TagNav";
import BlogSetting from "./components/BlogSetting";
import Loading from "./pages/Loading";

const Login = lazy(() => import("./pages/Login"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route
              path="/manage"
              element={
                <RequireAuth>
                  <AdminPanel />
                </RequireAuth>
              }
            >
              <Route index element={<ManageNav />} />
              <Route path="dashboard" element={<BlogDashboard />} />
              <Route path="post" element={<PostNav />}>
                <Route path="all-posts" element={<AllPosts />} />
                <Route path="new-post" element={<NewPost />} />
              </Route>
              <Route path="tag" element={<TagNav />}>
                <Route path="all-tags" element={<AllTags />} />
                <Route path="post-tags" element={<PostTags />} />
              </Route>
              <Route path="category" element={<CategoryNav />}>
                <Route path="all-categories" element={<AllCategories />} />
                <Route path="post-category" element={<PostCategory />} />
              </Route>
              <Route path="link" element={<LinkNav from="/manage/link" />}>
                <Route path="all-links" element={<AllLinks />} />
                <Route path="new-link" element={<NewLink />} />
                <Route path=":linkId" element={<EditLink />} />
                <Route index element={<LinkNav from="/manage/link/" />} />
              </Route>
              <Route path="comment" element={<CommentNav />}>
                <Route path="recent-comments" element={<RecentComments />} />
                <Route path="post-comments" element={<PostComments />} />
              </Route>
              <Route path="seo" element={<SEOSetting />} />
              <Route path="setting" element={<BlogSetting />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: "2rem" }}>
                    <p>404页面不存在</p>
                  </main>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
