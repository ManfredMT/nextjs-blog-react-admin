import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
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
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import fileDownload from 'js-file-download'
import { useSearchParams } from "react-router-dom";
import style from "../css/PostSearch.module.css";
import { deletePost, getPosts, reset } from "../features/posts/postSlice";

const { Option } = Select;

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

function getAllTags(posts) {
  let allTags = [];
  posts.forEach(({ tags }) => {
    tags.forEach((tag) => {
      if (allTags.includes(tag) === false) {
        allTags.push(tag);
      }
    });
  });
  return allTags.sort();
}

function getAllCategories(posts) {
  let allCategories = [];
  posts.forEach(({ category }) => {
    if (!allCategories.includes(category)) {
      allCategories.push(category);
    }
  });
  return allCategories.sort();
}

function getAllAuthors(posts) {
  let allAuthors = [];
  posts.forEach(({ authors }) => {
    authors.forEach((author) => {
      if (allAuthors.includes(author) === false) {
        allAuthors.push(author);
      }
    });
  });
  return allAuthors.sort();
}

function findPostByCategory(posts, c) {
  return posts.filter(({ category }) => category === c);
}

function findPostByTag(posts, tag) {
  return posts.filter(({ tags }) => tags.includes(tag));
}

function findPostByAuthor(posts, author) {
  return posts.filter(({ authors }) => authors.includes(author));
}

function postTitleFilter(posts, titleSearch) {
  return posts.filter(({ title }) =>
    title.toLowerCase().includes(titleSearch.toLowerCase())
  );
}

//只考虑发布日期，不考虑具体小时
function postDateFilter(posts, datePickerArray) {
  const dPStart = new Date(datePickerArray[0]);
  const dPEnd = new Date(datePickerArray[1]);
  //console.log("postDateFilter: ", dPStart, dPEnd);
  return posts.filter(({ date }) => {
    const dateSplit = date.split(" ")[0];
    const dateSplitMonth = dateSplit.split("/")[1];
    const dateFormattedMonth =
      parseInt(dateSplit.split("/")[1]) <= 9
        ? "0" + dateSplitMonth
        : dateSplitMonth;
    const dateSplitDay = dateSplit.split("/")[2];
    const dateFormattedDay =
      parseInt(dateSplit.split("/")[2]) <= 9
        ? "0" + dateSplitDay
        : dateSplitDay;
    const formattedPostDate =
      dateSplit.split("/")[0] +
      "-" +
      dateFormattedMonth +
      "-" +
      dateFormattedDay;
    //console.log("postDateFilter formattedPostDate: ", formattedPostDate);
    const modifiedDate = new Date(formattedPostDate);
    //console.log("postDateFilter modified date: ", modifiedDate,
    //dPStart<=modifiedDate && modifiedDate<=dPEnd);
    return dPStart <= modifiedDate && modifiedDate <= dPEnd;
  });
}

function dateArrayToString(datePickerArray) {
  return datePickerArray[0] + "_" + datePickerArray[1];
}

function dateStringToArray(dateParams) {
  return [dateParams.split("_")[0], dateParams.split("_")[1]];
}

function checkDateParams(dateParams) {
  if (dateParams.length !== 21) {
    return false;
  }
  if (dateParams[4] !== "-") {
    return false;
  }
  if (dateParams[7] !== "-") {
    return false;
  }
  if (dateParams[10] !== "_") {
    return false;
  }
  if (dateParams[15] !== "-") {
    return false;
  }
  if (dateParams[18] !== "-") {
    return false;
  }
  const numIndex = [0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 13, 14, 16, 17, 19, 20];
  for (let i of numIndex) {
    if (!("0" <= dateParams[i] && dateParams[i] <= "9")) {
      return false;
    }
  }
  const dateStartMonth = dateParams.slice(5, 7);
  const dateEndMonth = dateParams.slice(16, 18);
  const dateStartDay = dateParams.slice(8, 10);
  const dateEndDay = dateParams.slice(19);
  if (
    !(1 <= parseInt(dateStartMonth, 10) && parseInt(dateStartMonth, 10) <= 12)
  ) {
    return false;
  }
  if (!(1 <= parseInt(dateEndMonth, 10) && parseInt(dateEndMonth, 10) <= 12)) {
    return false;
  }
  if (!(1 <= parseInt(dateStartDay, 10) && parseInt(dateStartDay, 10) <= 31)) {
    return false;
  }
  if (!(1 <= parseInt(dateEndDay, 10) && parseInt(dateEndDay, 10) <= 31)) {
    return false;
  }

  return true;
}

function PostSearch() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();
  const defaultPageSize = 10;
  const [searchParams, setSearchParams] = useSearchParams();

  const { posts, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );

  const allPosts = useMemo(
    () =>
      posts.map((post) => {
        return {
          id: post._id,
          date: new Date(post.createdAt).toLocaleString(),
          ...post,
        };
      }),
    [posts]
  );

  console.log("allPosts: ", allPosts);
  const allTags = getAllTags(allPosts);
  const allCategories = getAllCategories(allPosts);
  const allAuthors = getAllAuthors(allPosts);

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

  useEffect(() => {
    if (isSuccess && message === "成功删除文章") {
      antMessage.success(message);
    }
  }, [isSuccess, message, posts]);

  const [currentPagePosts, setCurrentPagePosts] = useState(
    allPosts.slice(0, defaultPageSize)
  );
  const [paginationTotal, setPaginationTotal] = useState(allPosts.length);

  let filteredPosts = useRef(allPosts);
  //console.log("currentPagePosts: ",currentPagePosts);
  //console.log("filteredPosts: ",filteredPosts.current);

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPagePosts(filteredPosts.current.slice(start, end));
  };

  const onChangeSelectTag = (value) => {
    //console.log(`selected ${value}`);
    let filterResult = allPosts;
    if (
      searchParams.get("category") &&
      allCategories.includes(searchParams.get("category"))
    ) {
      filterResult = findPostByCategory(
        filterResult,
        searchParams.get("category")
      );
    }
    if (
      searchParams.get("author") &&
      allAuthors.includes(searchParams.get("author"))
    ) {
      filterResult = findPostByAuthor(filterResult, searchParams.get("author"));
    }
    if (searchParams.get("draft")) {
      const draftParams = searchParams.get("draft");
      if (draftParams === "only-draft") {
        filterResult = filterResult.filter(({ draft }) => draft === true);
      }
      if (draftParams === "only-published") {
        filterResult = filterResult.filter(({ draft }) => draft === false);
      }
    }
    if (searchParams.get("title")) {
      filterResult = postTitleFilter(filterResult, searchParams.get("title"));
    }
    if (searchParams.get("date") && checkDateParams(searchParams.get("date"))) {
      filterResult = postDateFilter(
        filterResult,
        dateStringToArray(searchParams.get("date"))
      );
    }
    if (value === "all-tags") {
      filteredPosts.current = filterResult;
    } else {
      filterResult = findPostByTag(filterResult, value);
      filteredPosts.current = filterResult;
    }
    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);
    if (value) {
      const searchObj = {};
      for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
      }
      if (value !== "all-tags") {
        setSearchParams({ ...searchObj, tag: value });
      } else {
        delete searchObj.tag;
        setSearchParams({ ...searchObj });
      }
    }
  };

  const renderPostTagSelect = (
    <>
      <span className={style["filter-label"]}>{`选择标签 : `}</span>
      <Select
        showSearch={!isTabletOrMobile}
        placeholder="选择标签"
        optionFilterProp="children"
        onChange={onChangeSelectTag}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        className={style["item-select"]}
        defaultValue={() => {
          if (allTags.length > 0) {
            if (searchParams.get("tag")) {
              if (allTags.includes(searchParams.get("tag"))) {
                return searchParams.get("tag");
              } else {
                return "all-tags";
              }
            } else {
              return "all-tags";
            }
          } else {
            return null;
          }
        }} //=first tag
      >
        <Option value="all-tags">所有标签</Option>
        {allTags.map((tag, i) => {
          return (
            <Option key={i} value={tag}>
              {tag}
            </Option>
          );
        })}
      </Select>
    </>
  );

  const onChangeSelectAuthor = (value) => {
    console.log(`selected ${value}`);
    let filterResult = allPosts;
    if (
      searchParams.get("category") &&
      allCategories.includes(searchParams.get("category"))
    ) {
      filterResult = findPostByCategory(
        filterResult,
        searchParams.get("category")
      );
    }
    if (searchParams.get("tag") && allTags.includes(searchParams.get("tag"))) {
      filterResult = findPostByTag(filterResult, searchParams.get("tag"));
    }
    if (searchParams.get("draft")) {
      const draftParams = searchParams.get("draft");
      if (draftParams === "only-draft") {
        filterResult = filterResult.filter(({ draft }) => draft === true);
      }
      if (draftParams === "only-published") {
        filterResult = filterResult.filter(({ draft }) => draft === false);
      }
    }
    if (searchParams.get("title")) {
      filterResult = postTitleFilter(filterResult, searchParams.get("title"));
    }
    if (searchParams.get("date") && checkDateParams(searchParams.get("date"))) {
      filterResult = postDateFilter(
        filterResult,
        dateStringToArray(searchParams.get("date"))
      );
    }

    if (value === "all-authors") {
      filteredPosts.current = filterResult;
    } else {
      filterResult = findPostByAuthor(filterResult, value);
      filteredPosts.current = filterResult;
    }

    console.log("onChangeSelectAuthor filteredPosts: ", filteredPosts.current);

    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);
    if (value) {
      const searchObj = {};
      for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
      }
      if (value !== "all-authors") {
        setSearchParams({ ...searchObj, author: value });
      } else {
        delete searchObj.author;
        setSearchParams({ ...searchObj });
      }
    }
  };

  const renderPostAuthorSelect = (
    <>
      <span className={style["filter-label"]}>{`选择作者 : `}</span>
      <Select
        showSearch={!isTabletOrMobile}
        placeholder="选择作者"
        optionFilterProp="children"
        onChange={onChangeSelectAuthor}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        className={style["item-select"]}
        defaultValue={() => {
          if (allAuthors.length > 0) {
            if (searchParams.get("author")) {
              if (allAuthors.includes(searchParams.get("author"))) {
                //onChangeSelectAuthor(searchParams.get("author"));
                return searchParams.get("author");
              } else {
                return "all-authors";
              }
            } else {
              return "all-authors";
            }
          } else {
            return null;
          }
        }} //=first author
      >
        <Option value="all-authors">所有作者</Option>
        {allAuthors.map((author, i) => {
          return (
            <Option key={i} value={author}>
              {author}
            </Option>
          );
        })}
      </Select>
    </>
  );

  const onChangeSelectCategory = (value) => {
    console.log(`selected ${value}`);
    let filterResult = allPosts;
    if (
      searchParams.get("author") &&
      allAuthors.includes(searchParams.get("author"))
    ) {
      filterResult = findPostByAuthor(filterResult, searchParams.get("author"));
    }
    if (searchParams.get("tag") && allTags.includes(searchParams.get("tag"))) {
      filterResult = findPostByTag(filterResult, searchParams.get("tag"));
    }
    if (searchParams.get("draft")) {
      const draftParams = searchParams.get("draft");
      if (draftParams === "only-draft") {
        filterResult = filterResult.filter(({ draft }) => draft === true);
      }
      if (draftParams === "only-published") {
        filterResult = filterResult.filter(({ draft }) => draft === false);
      }
    }
    if (searchParams.get("title")) {
      filterResult = postTitleFilter(filterResult, searchParams.get("title"));
    }
    if (searchParams.get("date") && checkDateParams(searchParams.get("date"))) {
      filterResult = postDateFilter(
        filterResult,
        dateStringToArray(searchParams.get("date"))
      );
    }

    if (value === "all-categories") {
      filteredPosts.current = filterResult;
    } else {
      filterResult = findPostByCategory(filterResult, value);
      filteredPosts.current = filterResult;
    }

    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);
    if (value) {
      const searchObj = {};
      for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
      }
      if (value !== "all-categories") {
        setSearchParams({ ...searchObj, category: value });
      } else {
        delete searchObj.category;
        setSearchParams({ ...searchObj });
      }
    }
  };

  const renderPostSelectCategory = (
    <>
      <span className={style["filter-label"]}>{`选择分类 : `}</span>
      <Select
        showSearch={!isTabletOrMobile}
        placeholder="选择分类"
        optionFilterProp="children"
        onChange={onChangeSelectCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        className={style["item-select"]}
        defaultValue={() => {
          if (allCategories.length > 0) {
            if (searchParams.get("category")) {
              if (allCategories.includes(searchParams.get("category"))) {
                //onChangeSelectCategory(searchParams.get("category"));
                return searchParams.get("category");
              } else {
                return "all-categories";
              }
            } else {
              return "all-categories";
            }
          } else {
            return null;
          }
        }} //=first category
      >
        <Option value="all-categories">所有分类</Option>
        {allCategories.map((category, i) => {
          return (
            <Option key={i} value={category}>
              {category}
            </Option>
          );
        })}
      </Select>
    </>
  );

  const [searchText, setSearchText] = useState("");
  const [isTitleFiltered, setIsTitleFiltered] = useState(false);

  const onSearchTitle = (value) => {
    let filterResult = allPosts;
    if (
      searchParams.get("author") &&
      allAuthors.includes(searchParams.get("author"))
    ) {
      filterResult = findPostByAuthor(filterResult, searchParams.get("author"));
    }
    if (searchParams.get("tag") && allTags.includes(searchParams.get("tag"))) {
      filterResult = findPostByTag(filterResult, searchParams.get("tag"));
    }
    if (searchParams.get("draft")) {
      const draftParams = searchParams.get("draft");
      if (draftParams === "only-draft") {
        filterResult = filterResult.filter(({ draft }) => draft === true);
      }
      if (draftParams === "only-published") {
        filterResult = filterResult.filter(({ draft }) => draft === false);
      }
    }
    if (
      searchParams.get("category") &&
      allCategories.includes(searchParams.get("category"))
    ) {
      filterResult = findPostByCategory(
        filterResult,
        searchParams.get("category")
      );
    }
    if (searchParams.get("date") && checkDateParams(searchParams.get("date"))) {
      filterResult = postDateFilter(
        filterResult,
        dateStringToArray(searchParams.get("date"))
      );
    }

    const searchObj = {};
    for (const [key, value] of searchParams.entries()) {
      searchObj[key] = value;
    }

    if (value === "" || !value) {
      filteredPosts.current = filterResult;
      setIsTitleFiltered(false);
      delete searchObj.title;
      setSearchParams({ ...searchObj });
    } else {
      filterResult = postTitleFilter(filterResult, value);
      filteredPosts.current = filterResult;
      //console.log("after title filter: ",filteredPosts.current);
      setIsTitleFiltered(true);
      setSearchParams({ ...searchObj, title: value });
    }
    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);
  };

  const onChangeTitleFilter = (e) => {
    setSearchText(e.target.value);
  };

  const renderPostTitleFilter = (
    <>
      <span className={style["filter-label"]}>{`文章标题 : `}</span>
      <Input.Search
        className={style["input-search"]}
        allowClear
        onSearch={onSearchTitle}
        value={searchText}
        onChange={onChangeTitleFilter}
      />
    </>
  );

  const onChangeDate = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    const dateArray = dateString;

    let filterResult = allPosts;
    if (
      searchParams.get("author") &&
      allAuthors.includes(searchParams.get("author"))
    ) {
      filterResult = findPostByAuthor(filterResult, searchParams.get("author"));
    }
    if (searchParams.get("tag") && allTags.includes(searchParams.get("tag"))) {
      filterResult = findPostByTag(filterResult, searchParams.get("tag"));
    }
    if (searchParams.get("draft")) {
      const draftParams = searchParams.get("draft");
      if (draftParams === "only-draft") {
        filterResult = filterResult.filter(({ draft }) => draft === true);
      }
      if (draftParams === "only-published") {
        filterResult = filterResult.filter(({ draft }) => draft === false);
      }
    }
    if (
      searchParams.get("category") &&
      allCategories.includes(searchParams.get("category"))
    ) {
      filterResult = findPostByCategory(
        filterResult,
        searchParams.get("category")
      );
    }
    if (searchParams.get("title")) {
      filterResult = postTitleFilter(filterResult, searchParams.get("title"));
    }

    const searchObj = {};
    for (const [key, value] of searchParams.entries()) {
      searchObj[key] = value;
    }

    if (value === null) {
      filteredPosts.current = filterResult;
      delete searchObj.date;
      setSearchParams({ ...searchObj });
    } else {
      filterResult = postDateFilter(filterResult, dateArray);
      filteredPosts.current = filterResult;
      setSearchParams({ ...searchObj, date: dateArrayToString(dateArray) });
    }
    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);
  };

  const renderPostDatePicker = (
    <>
      <span className={style["filter-label"]}>{`文章发布时间 : `}</span>
      <DatePicker.RangePicker
        // showTime={{
        //   format: 'HH:mm',
        // }}
        //format="YYYY-MM-DD HH:mm"
        className={style["date-range-picker"]}
        onChange={onChangeDate}
        defaultValue={() => {
          if (
            searchParams.get("date") &&
            checkDateParams(searchParams.get("date"))
          ) {
            const dateParams = searchParams.get("date");
            const startDay = moment(dateParams.split("_")[0]);
            const endDay = moment(dateParams.split("_")[1]);
            return [startDay, endDay];
          } else {
            return null;
          }
        }}
      />
    </>
  );

  const [radioValue, setRadioValue] = useState("all-posts");

  const onChangeRadio = (e) => {
    console.log("radio checked", e.target.value);
    const radioChecked = e.target.value;
    setRadioValue(e.target.value);
    let filterResult = allPosts;
    if (
      searchParams.get("author") &&
      allAuthors.includes(searchParams.get("author"))
    ) {
      filterResult = findPostByAuthor(filterResult, searchParams.get("author"));
    }
    if (searchParams.get("tag") && allTags.includes(searchParams.get("tag"))) {
      filterResult = findPostByTag(filterResult, searchParams.get("tag"));
    }
    if (
      searchParams.get("category") &&
      allCategories.includes(searchParams.get("category"))
    ) {
      filterResult = findPostByCategory(
        filterResult,
        searchParams.get("category")
      );
    }
    if (searchParams.get("title")) {
      filterResult = postTitleFilter(filterResult, searchParams.get("title"));
    }
    if (searchParams.get("date") && checkDateParams(searchParams.get("date"))) {
      filterResult = postDateFilter(
        filterResult,
        dateStringToArray(searchParams.get("date"))
      );
    }

    if (radioChecked === "only-draft") {
      filterResult = filterResult.filter(({ draft }) => draft === true);
      filteredPosts.current = filterResult;
    } else if (radioChecked === "only-published") {
      filterResult = filterResult.filter(({ draft }) => draft === false);
      filteredPosts.current = filterResult;
    } else if (radioChecked === "all-posts") {
      filteredPosts.current = filterResult;
    }

    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);

    if (radioChecked) {
      const searchObj = {};
      for (const [key, value] of searchParams.entries()) {
        searchObj[key] = value;
      }
      if (radioChecked !== "all-posts") {
        setSearchParams({ ...searchObj, draft: radioChecked });
      } else {
        delete searchObj.draft;
        setSearchParams({ ...searchObj });
      }
    }
  };

  const renderPostSelectDraft = (
    <>
      <span className={style["filter-label"]}>{`是否为草稿 : `}</span>
      <Radio.Group onChange={onChangeRadio} value={radioValue}>
        <Radio value={"all-posts"}>所有文章</Radio>
        <Radio value={"only-draft"}>仅草稿</Radio>
        <Radio value={"only-published"}>已发布文章</Radio>
      </Radio.Group>
    </>
  );

  const postIdRef = useRef("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    if (postIdRef.current !== "") {
      dispatch(deletePost(postIdRef.current));
      postIdRef.current = "";
    } else {
      antMessage.error("删除失败");
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    setCurrentPagePosts(allPosts.slice(0, defaultPageSize));
    setPaginationTotal(allPosts.length);
    filteredPosts.current = allPosts;
    if (
      searchParams.get("draft") &&
      ["all-posts", "only-draft", "only-published"].includes(
        searchParams.get("draft")
      )
    ) {
      setRadioValue(searchParams.get("draft"));
    }
    if (searchParams.get("title")) {
      setSearchText(searchParams.get("title"));
    }
    onSearchTitle(searchParams.get("title"));
  }, [allPosts]);

  const onClickEdit = ({ postId }, e) => {
    setSearchParams({ edit: postId });
  };

  const onClickDelete = ({ postId }, e) => {
    postIdRef.current = postId;
    setIsModalVisible(true);
  };

  const downloadMD=({postId}, e)=>{
    const currentPost = allPosts.find((post)=>post.id===postId);
    let tagsString = '';
    currentPost.tags.forEach(tag=>{
      tagsString+='\n- '+tag;
    })
    const  frontMatter = 
    `---
title: ${currentPost.title}
date: ${currentPost.date}
updated: ${new Date(currentPost.updatedAt).toLocaleString()}
draft: ${currentPost.draft}
category: 
- ${currentPost.category}
tags:${tagsString}
---

`
    const content = currentPost.content??'';
    const frontMatterLF = frontMatter.replace(/\r\n/g, "\n");
    const contentLF = content.replace(/\r\n/g, "\n");
    const mdBlob = new Blob([frontMatterLF,contentLF], {type: 'text/plain'});
    fileDownload(mdBlob, currentPost.title+".md");
  }

  return !isLoading ? (
    <>
      <div className={style["select-list-box"]}>
        <div className={style["filter-header"]}>
          <>{renderPostTitleFilter}</>
          <>{renderPostTagSelect}</>
          <>{renderPostSelectCategory}</>
          <>{renderPostAuthorSelect}</>
          <>{renderPostDatePicker}</>
          <>{renderPostSelectDraft}</>
        </div>
        <div
          className={style["post-number"]}
        >{`共${paginationTotal}篇文章`}</div>

        {isTabletOrMobile ? null : <Divider />}
        <div className={style["grid-wrap"]}>
          {currentPagePosts.length > 0 ? (
            currentPagePosts.map((post, i) => {
              return (
                <div key={post.id}>
                  <div className={style["list-item-wrap"]}>
                    <div className={style["list-left-box"]}>
                      <h1
                        className={
                          style[post.draft ? "post-title-draft" : "post-title"]
                        }
                      >
                        {isTitleFiltered ? (
                          <Highlighter
                            highlightStyle={{
                              backgroundColor: "#ffc069",
                              padding: 0,
                            }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={post.title}
                          ></Highlighter>
                        ) : (
                          post.title
                        )}
                      </h1>
                      {post.draft ? (
                        <p className={style["draft-label"]}>草稿</p>
                      ) : (
                        <p>
                          <span className={style["grey-label"]}>
                            发布日期:{" "}
                          </span>
                          {post.date}
                        </p>
                      )}

                      <p>
                        <span className={style["grey-label"]}>作者: </span>
                        {post.authors.map((author, i) => (
                          <span key={i}>{`${author} `}</span>
                        ))}
                      </p>
                    </div>

                    <div className={style["list-middle-box"]}>
                      <div className={style["post-category-box"]}>
                        <span className={style["middle-box-label"]}>
                          分类:{" "}
                        </span>
                        <span className={style["inline-items-box-c"]}>
                          {post.category}
                        </span>
                      </div>
                      <div className={style["post-tags-box"]}>
                        <span className={style["middle-box-label"]}>
                          标签:{" "}
                        </span>
                        <div className={style["inline-items-box"]}>
                          {post.tags.length !== 0 ? (
                            post.tags.map((tag, i) => {
                              if (tag) {
                                return (
                                  <span className={style["tag-box"]} key={i}>
                                    {tag}
                                  </span>
                                );
                              } else {
                                return <span key={i}>ERROR!</span>;
                              }
                            })
                          ) : (
                            <span>无标签</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={style["buttons-box"]}>
                      {post.draft ? null : (
                        <button className={style["preview-button"]}>
                          <EyeOutlined />
                          {" 预览"}
                        </button>
                      )}
                      <button
                        onClick={(e) => onClickEdit({ postId: post.id }, e)}
                        className={style["edit-button"]}
                      >
                        <EditOutlined />
                        {" 编辑"}
                      </button>
                      <button
                        onClick={(e) => onClickDelete({ postId: post.id }, e)}
                        className={style["delete-button"]}
                      >
                        <DeleteOutlined />
                        {" 删除"}
                      </button>
                      <button 
                      onClick={(e)=>downloadMD({ postId: post.id }, e)}
                      className={style["download-md-file-button"]}>
                        <DownloadOutlined />
                        {" 下载.md文件"}
                      </button>
                    </div>
                  </div>
                  {isTabletOrMobile ? null : <Divider />}
                </div>
              );
            })
          ) : (
            <Empty />
          )}
        </div>

        {paginationTotal > defaultPageSize ? (
          <Pagination
            className={style["pagination"]}
            total={paginationTotal}
            onChange={onChangePage}
            showSizeChanger={false}
            pageSize={defaultPageSize}
          ></Pagination>
        ) : null}
      </div>
      <Modal
        title="删除文章"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>确定删除文章?</p>
      </Modal>
    </>
  ) : (
    <Spin className={style["spin-center"]} indicator={antIcon} />
  );
}

export default PostSearch;
