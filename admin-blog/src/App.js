import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryNav from "./components/CategoryNav";
import CommentNav from "./components/CommentNav";
import LinkNav from "./components/LinkNav.jsx";
import ManageNav from "./components/ManageNav";
import PostNav from "./components/PostNav";
import RequireAuth from "./components/RequireAuth.jsx";
import TagNav from "./components/TagNav";
import Loading from "./pages/Loading";
import HCenterSpin from "./components/HCenterSpin";
import Login from "./pages/Login";
import MediaNav from "./components/MediaNav.jsx";
import AllImages from "./components/AllImages.jsx";
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AllPosts = lazy(() => import("./components/AllPosts.jsx"));
const NewPost = lazy(() => import("./components/NewPost"));
const AllTags = lazy(() => import("./components/AllTags"));
const PostTags = lazy(() => import("./components/PostTags"));
const AllCategories = lazy(() => import("./components/AllCategories"));
const PostCategory = lazy(() => import("./components/PostCategory"));
const AllLinks = lazy(() => import("./components/AllLinks"));
const NewLink = lazy(() => import("./components/NewLink"));
const EditLink = lazy(() => import("./components/EditLink"));
const RecentComments = lazy(() => import("./components/RecentComments"));
const PostComments = lazy(() => import("./components/PostComments"));
const BlogSetting = lazy(() => import("./components/BlogSetting"));
const ChangePassword = lazy(() => import("./components/ChangePassword"));
const BlogDashboard = lazy(() => import("./components/BlogDashboard"));

function App() {
  return (
    <>
      <Router>
        <>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route
              path="/manage"
              element={
                <RequireAuth>
                  <Suspense fallback={<Loading />}>
                    <AdminPanel />
                  </Suspense>
                </RequireAuth>
              }
            >
              <Route index element={<ManageNav />} />
              <Route
                path="dashboard"
                element={
                  <Suspense fallback={<HCenterSpin />}>
                    <BlogDashboard />
                  </Suspense>
                }
              />
              <Route path="post" element={<PostNav />}>
                <Route
                  path="all-posts"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <AllPosts />
                    </Suspense>
                  }
                />
                <Route
                  path="new-post"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <NewPost />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="tag" element={<TagNav />}>
                <Route
                  path="all-tags"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <AllTags />
                    </Suspense>
                  }
                />
                <Route
                  path="post-tags"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <PostTags />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="category" element={<CategoryNav />}>
                <Route
                  path="all-categories"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <AllCategories />
                    </Suspense>
                  }
                />
                <Route
                  path="post-category"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <PostCategory />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="media" element={<MediaNav from="/manage/media" />}>
                <Route
                  path="all-images"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <AllImages />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="link" element={<LinkNav from="/manage/link" />}>
                <Route
                  path="all-links"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <AllLinks />
                    </Suspense>
                  }
                />
                <Route
                  path="new-link"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <NewLink />
                    </Suspense>
                  }
                />
                <Route
                  path=":linkId"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <EditLink />
                    </Suspense>
                  }
                />
                <Route index element={<LinkNav from="/manage/link/" />} />
              </Route>
              <Route path="comment" element={<CommentNav />}>
                <Route
                  path="recent-comments"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <RecentComments />
                    </Suspense>
                  }
                />
                <Route
                  path="post-comments"
                  element={
                    <Suspense fallback={<HCenterSpin />}>
                      <PostComments />
                    </Suspense>
                  }
                />
              </Route>

              <Route
                path="setting"
                element={
                  <Suspense fallback={<HCenterSpin />}>
                    <BlogSetting />
                  </Suspense>
                }
              />
              <Route
                path="change-password"
                element={
                  <Suspense fallback={<HCenterSpin />}>
                    <ChangePassword />
                  </Suspense>
                }
              />

              <Route
                path="*"
                element={
                  <main style={{ padding: "2rem" }}>
                    <p>页面不存在</p>
                  </main>
                }
              />
            </Route>
            <Route
              path="*"
              element={
                <main style={{ padding: "2rem" }}>
                  <p>页面不存在</p>
                </main>
              }
            />
          </Routes>
        </>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
