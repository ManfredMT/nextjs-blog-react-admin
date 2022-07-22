import { Calendar, message as antMessage } from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import style from "../css/BlogDashboard.module.css";
import { getPosts, reset } from "../features/posts/postSlice";
import WordCloud from "./WordCloud";
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';

import {
  getComments,
  reset as resetComments,
} from "../features/comments/commentSlice";
import usePrevious from "../hooks/usePrevious";
import HCenterSpin from "./HCenterSpin";


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
  SVGRenderer
])

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

function getMonthSeries(posts) {
  const todayDateObject = new Date();
  const allTagsList = [];
  const allCategoriesList = [];
  const dateSeries = [];
  const postSeries = [];
  const tagSeries = [];
  const categorySeries = [];
  let tagStackNum = 0;
  let postStackNum = 0;
  let categoryStackNum = 0;
  const todayDate = todayDateObject.getDate();
  
  
  //windowEnd.setDate(todayDate-30);

  for(let i=0;i<=30;i+=2) {
    const windowStart = new Date();
    const windowEnd = new Date();
    windowStart.setDate(todayDate-31+i);
    windowStart.setHours(0,0,0,0);
    windowEnd.setDate(todayDate-30+i);
    windowEnd.setHours(0,0,0,0);
    dateSeries.push(`${windowEnd.getMonth()+1}.${windowEnd.getDate()}`);
    let windowPosts;
    if(i===0) {
      windowPosts = posts.filter((post)=>{
        const postDateClearTime = post.date.setHours(0,0,0,0);
        return postDateClearTime<=windowEnd;
      })
    }else {
      windowPosts = posts.filter((post)=>{
        const postDateClearTime = post.date.setHours(0,0,0,0);
        return windowStart<=postDateClearTime&&postDateClearTime<=windowEnd;
      })
    }
    for(let j=0;j<windowPosts.length;j++) {
      const post = windowPosts[j];
      postStackNum+=1;
      if(!allCategoriesList.includes(post.category)) {
        categoryStackNum+=1;
        allCategoriesList.push(post.category);
      }
      for(let k=0;k<post.tags.length;k++) {
        const tag = post.tags[k];
        if(!allTagsList.includes(tag)) {
          tagStackNum+=1;
          allTagsList.push(tag);
        }
      }
    }
    postSeries.push(postStackNum);
    categorySeries.push(categoryStackNum);
    tagSeries.push(tagStackNum);  

  }
  return {
    dateSeries,
    postSeries,
    categorySeries,
    tagSeries,
  }

}

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
  // console.log("isSuccess: ", isSuccess);
  // console.log("isSuccessCom: ", isSuccessCom);
  // console.log("preIsSuccess: ", preIsSuccess);
  // console.log("preIsSucCom: ", preIsSucCom);
  // console.log("allPosts: ", allPosts);
  // console.log("comments: ", comments);

  const chartRef = useRef(null);

  const chartsData = useMemo(()=>getMonthSeries(allPosts),[allPosts]);
  console.log("chartsData",chartsData);
  
  useEffect(() => {
    if (isSuccess && isSuccessCom) {
       let myChart = echarts.init(chartRef.current);
      myChart.setOption({
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: '博客动态'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          right: isTabletOrMobile?10:'10%',
          data: ['文章数', '分类数', '标签数']
        },
        
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: chartsData.dateSeries
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '文章数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: chartsData.postSeries
          },
          {
            name: '分类数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(77, 119, 255)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: chartsData.categorySeries
          },
          {
            name: '标签数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(55, 162, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(116, 21, 219)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: chartsData.tagSeries
          },
        ]
      });
    }
  }, [isSuccess, isSuccessCom]);

  return isSuccess && isSuccessCom ? (
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
        <div ref={chartRef} id="chart" className={style["archive-card-body"]}>
          {/* <p className={style["card-title"]}>日历:</p>
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
          )} */}
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
