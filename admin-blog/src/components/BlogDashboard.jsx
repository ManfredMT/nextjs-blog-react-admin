import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useMemo } from "react";
import { checkJWT } from "../features/auth/authSlice";
import WordCloud from "./WordCloud";
import style from "../css/BlogDashboard.module.css";
import { Link } from "react-router-dom";
import { Calendar } from "antd";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import { useMediaQuery } from "react-responsive";
import {
  DatePicker,
  Divider,
  Empty,
  Input,
  message as antMessage,
  Modal,
  Pagination,
  Radio,
  Select,
  Spin,
} from "antd";
import { deletePost, getPosts, reset } from "../features/posts/postSlice";

import HCenterSpin from "./HCenterSpin";
import usePrevious from "../hooks/usePrevious";
import {
  reset as resetComments,
  getComments,
} from "../features/comments/commentSlice";

// let AllPosts = [];
// for (let j = 0; j <= 56; j++) {
//   const fakeTags = [...Array(5).keys()].map(
//     (i) => `标签tag-${parseInt((j + i + 1) % 12)}`
//   );
//   const dateObj = new Date();
//   dateObj.setDate(dateObj.getDate() - (j + 1));

//   const fakeAuthor = j >= 30 ? "author2" : "admin";
//   AllPosts.push({
//     id: `post_${j + 1}`,
//     title: `JavaScript 的关键功能，比如变量、字符串、数字、数组等(${j + 1})`,
//     date: dateObj,
//     tags: fakeTags,
//     category: `category-${parseInt((j + 1) % 10)}`,
//     draft: parseInt(j % 10) === 0 ? true : false,
//     authors: [fakeAuthor],
//     images: undefined,
//   });
// }

// AllPosts = AllPosts.filter((post) => !post.draft);

function getAllTags(posts) {
  let AllTags = [];
  posts.forEach(({ tags }) => {
    tags.forEach((tag) => {
      if (AllTags.includes(tag) === false) {
        AllTags.push(tag);
      }
    });
  });
  return AllTags.sort();
}

function getAllCategories(posts) {
  let AllCategories = [];
  posts.forEach(({ category }) => {
    if (!AllCategories.includes(category)) {
      AllCategories.push(category);
    }
  });
  return AllCategories.sort();
}

function getMonthArchive(posts) {
  let monthArchive = [];
  const timeSortPosts = posts.sort((a, b) => {
    return b.date - a.date;
  });
  timeSortPosts.forEach(({ date }) => {
    const postYear = date.getFullYear();
    const postMonth = date.getMonth() + 1;
    const postYMString = postYear + "-" + postMonth;
    const monthList = monthArchive.map((archive) => archive.date);
    if (monthList.includes(postYMString)) {
      const mAIndex = monthArchive.findIndex(
        (archive) => archive.date === postYMString
      );
      monthArchive[mAIndex].postNumber += 1;
    } else {
      monthArchive.push({ date: postYMString, postNumber: 1 });
    }
  });
  return monthArchive;
}

function getDayArchive(posts) {
  let dayArchive = [];
  const timeSortPosts = posts.sort((a, b) => {
    return b.date - a.date;
  });
  timeSortPosts.forEach(({ date }) => {
    const postYear = date.getFullYear();
    const postMonth = date.getMonth() + 1;
    const postDay = date.getDate();
    const postYMDString = postYear + "-" + postMonth + "-" + postDay;
    const dayList = dayArchive.map((archive) => archive.date);
    if (dayList.includes(postYMDString)) {
      const dAIndex = dayArchive.findIndex(
        (archive) => archive.date === postYMDString
      );
      dayArchive[dAIndex].postNumber += 1;
    } else {
      dayArchive.push({ date: postYMDString, postNumber: 1 });
    }
  });
  return dayArchive;
}

// const monthArchive = getMonthArchive(AllPosts);

// const dayArchive = getDayArchive(AllPosts);

// const AllTags = getAllTags(AllPosts);
// const AllCategories = getAllCategories(AllPosts);



function BlogDashboard() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();

  const {
    comments: commentData,
    isSuccess: isSuccessCom,
    isError: isErrorCom,
    message: messageCom,
  } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(getComments());
    return () => {
      dispatch(resetComments());
    };
  }, []);

  let isErrorResetCom = useRef(false);
  useEffect(() => {
    if (!isErrorCom) {
      isErrorResetCom.current = true;
    }
    if (isErrorResetCom.current && isErrorCom) {
      antMessage.error(messageCom);
    }
  }, [isErrorCom, messageCom]);

  const comments = useMemo(
    () =>
      commentData.map((c) => {
        return {
          id: c._id,
          source: c.source,
          time: new Date(c.createdAt),
          author: c.username,
          commentContent: c.comment,
        };
      }),
    [commentData]
  );

  const { posts, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(getPosts());
    return () => {
      dispatch(reset());
    };
  }, []);

  let isErrorReset = useRef(false);

  useEffect(() => {
    if (!isError) {
      isErrorReset.current = true;
    }
    if (isErrorReset.current && isError) {
      antMessage.error(message);
    }
  }, [isError, message]);

  const allPosts = useMemo(
    () =>
      posts
        .filter((p) => !p.draft)
        .map((post) => {
          return {
            id: post._id,
            date: new Date(post.createdAt),
            ...post,
          };
        }),
    [posts]
  );

  const monthArchive = getMonthArchive(allPosts);
  const dayArchive = getDayArchive(allPosts);
  const allTags = getAllTags(allPosts);
  const allCategories = getAllCategories(allPosts);

  const dateCellRender = (value) => {
    //console.log(value);
    const formatDate = value.format("YYYY-M-D");
    const archiveIndex = dayArchive.findIndex(
      (archive) => archive.date === formatDate
    );
    if (archiveIndex === -1) {
      return null;
    } else {
      return (
        <div
          className={style["calendar-post-number"]}
        >{`(${dayArchive[archiveIndex].postNumber})`}</div>
      );
    }
  };

  const monthCellRender = (value) => {
    const formatDate = value.format("YYYY-M");
    //console.log("月份: ",formatDate);
    const archiveIndex = monthArchive.findIndex(
      (archive) => archive.date === formatDate
    );
    if (archiveIndex === -1) {
      return null;
    } else {
      return (
        <div
          className={style["calendar-post-number"]}
        >{`(${monthArchive[archiveIndex].postNumber})`}</div>
      );
    }
  };

  const preIsSuccess = usePrevious(isSuccess);
  const preIsSucCom = usePrevious(isSuccessCom);

  return isSuccess && preIsSuccess && isSuccessCom && preIsSucCom ? (
    <div className={style["dashboard-body"]}>
      <div className={style["first-row"]}>
        <div className={style["number-card-box"]}>
          <p>文章数</p>
          <p>{allPosts.length}</p>
        </div>
        <div className={style["number-card-box"]}>
          <p>标签数</p>
          <p>{allTags.length}</p>
        </div>
        <div className={style["number-card-box"]}>
          <p>分类数</p>
          <p>{allCategories.length}</p>
        </div>
        <div className={style["number-card-box"]}>
          <p>评论数</p>
          <p>{comments.length}</p>
        </div>
      </div>

      <div className={style["archive-cloud-row"]}>
        <div className={style["word-cloud-box"]}>
          <WordCloud words={allTags} speed={10} />
        </div>
        <div className={style["archive-card-body"]}>
          <p className={style["card-title"]}>日历:</p>
          <hr />
          {isTabletOrMobile ? (
            <ul>
              {monthArchive.map((archive, i) => {
                return (
                  <li key={i} className={style["archive-list"]}>
                    <span>{archive.date.replace("-", "年") + "月"}</span>
                    <span
                      className={style["archive-number"]}
                    >{`(${archive.postNumber})`}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Calendar
              locale={locale}
              fullscreen={false}
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender}
            />
          )}
        </div>
      </div>

      <div className={style["recent-list-row"]}>
        <div className={style["recent-post-body"]}>
          <p className={style["card-title"]}>最新文章:</p>
          <hr />
          <ul>
            {allPosts
              .slice(0, 5)
              .sort((a, b) => b.date - a.date)
              .map((post, i) => {
                //console.log(post.date);
                return (
                  <li key={i} className={style["recent-post-list"]}>
                    <Link to={`/manage/post/all-posts?preview=${post.id}`}>
                      <span>{post.title}</span>
                      <span className={style["post-date"]}>
                        {post.date.toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className={style["recent-comment-body"]}>
          <div className={style["card-header"]}>
            <p className={style["card-title"]}>最新评论:</p>
            <Link to="/manage/comment/recent-comments">
              <p className={style["card-title-more"]}>{`更多 >`}</p>
            </Link>
          </div>
          <hr />
          <ul className={style["comment-ul-wrap"]}>
            {comments
              .slice(0, 5)
              .sort((a, b) => b.time - a.time)
              .map((comment, i) => {
                return (
                  <li key={i}>
                    <div className={style["comment-list"]}>
                      <p className={style["comment-text"]}>
                        {comment.commentContent}
                      </p>
                      <p>{comment.time.toLocaleDateString()}</p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <HCenterSpin />
  );
}

export default BlogDashboard;
