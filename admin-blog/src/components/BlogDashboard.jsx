import { message as antMessage } from "antd";
import { LineChart } from "echarts/charts";
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import style from "../css/BlogDashboard.module.css";
import { getPosts, reset, resetError } from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
import useStackedLineChart from "../hooks/useStackedLineChart";
import {
  getComments,
  reset as resetComments,
  resetError as resetErrorComments,
} from "../features/comments/commentSlice";
import HCenterSpin from "./HCenterSpin";

const WordCloud = lazy(() => import("./WordCloud"));

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
]);

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

function BlogDashboard() {
  const dispatch = useDispatch();

  const {
    comments: commentData,
    isError: isErrorCom,
    isLoadEnd: isLoadEndCom,
    message: messageCom,
  } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(getComments());
    return () => {
      dispatch(resetComments());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isErrorCom) {
      antMessage.error(messageCom);
    }
    return () => {
      dispatch(resetErrorComments());
    };
  }, [isErrorCom, messageCom, dispatch]);

  const comments = useMemo(() => {
    //console.log("commentData: ", commentData);
    if (commentData) {
      return commentData.map((c) => {
        return {
          id: c._id,
          source: c.source,
          time: new Date(c.createdAt),
          author: c.username,
          commentContent: c.comment,
        };
      });
    } else {
      return [];
    }
  }, [commentData]);

  const { posts, isError, isLoadEnd, message } = useSelector(
    (state) => state.posts
  );

  useGetData(getPosts, reset, isError, message, resetError);

  const allPosts = useMemo(() => {
    const postList = posts
      .filter((p) => !p.draft)
      .map((post) => {
        return {
          id: post._id,
          date: new Date(post.createdAt),
          ...post,
        };
      });
    postList.sort((a, b) => b.date - a.date);
    return postList;
  }, [posts]);

  const allTags = getAllTags(allPosts);
  const allCategories = getAllCategories(allPosts);

  const chartRef = useRef(null);
  const { chartOption } = useStackedLineChart(allPosts, echarts);

  useEffect(() => {
    let myChart;
    if (isLoadEnd && isLoadEndCom) {
      myChart = echarts.init(chartRef.current);
      myChart.setOption(chartOption);
    }
    return () => {
      //消除echarts的初始化,否则报警告.
      if (myChart !== null && myChart !== "" && myChart !== undefined) {
        myChart.dispose();
      }
    };
  }, [isLoadEnd, isLoadEndCom, chartOption]);

  return isLoadEnd && isLoadEndCom ? (
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
          <Suspense fallback={<HCenterSpin verticallyCenter={true} />}>
            <WordCloud words={allTags} speed={10} />
          </Suspense>
        </div>
        <div
          ref={chartRef}
          id="chart"
          className={style["archive-card-body"]}
        ></div>
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
              .sort((a, b) => b.time - a.time)
              .slice(0, 5)
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
