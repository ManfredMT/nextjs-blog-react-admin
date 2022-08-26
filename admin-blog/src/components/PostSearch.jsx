import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
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
} from "antd";
import fileDownload from "js-file-download";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "react-router-dom";
import style from "../css/PostSearch.module.css";
import { deletePost, getPosts, reset, resetError } from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
import HCenterSpin from "./HCenterSpin";

const { Option } = Select;

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
    const modifiedDate = new Date(formattedPostDate);
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
  //正则表达式匹配的日期格式: "YYYY-MM-DD_YYYY-MM-DD"
  const RE = /^\d{4}-(\d{2})-(\d{2})_\d{4}-(\d{2})-(\d{2})$/;
  //console.log("Regex exec: ", RE.exec("2020-04-01_2022-08-02"));
  const match = RE.exec(dateParams);
  if (match === null) {
    return false;
  }
  const dateStartMonth = parseInt(match[1], 10);
  const dateStartDay = parseInt(match[1], 10);
  const dateEndMonth = parseInt(match[1], 10);
  const dateEndDay = parseInt(match[1], 10);
  if (
    !(1 <= dateStartMonth && dateStartMonth <= 12) ||
    !(1 <= dateEndMonth && dateEndMonth <= 12) ||
    !(1 <= dateStartDay && dateStartDay <= 31) ||
    !(1 <= dateEndDay && dateEndDay <= 31)
  ) {
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

  //console.log("posts: ",posts);
  const allPosts = useMemo(() => {
    const unsortedPosts = posts.map((post) => {
      return {
        id: post._id,
        date: new Date(post.createdAt).toLocaleString(),
        ...post,
      };
    });
    const sortedPosts = unsortedPosts.sort(
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
    );
    return sortedPosts;
  }, [posts]);

  useGetData(getPosts, reset, isError, message, resetError);

  //console.log("allPosts: ", allPosts);
  const allTags = useMemo(() => getAllTags(allPosts), [allPosts]);
  const allCategories = useMemo(() => getAllCategories(allPosts), [allPosts]);
  const allAuthors = useMemo(() => getAllAuthors(allPosts), [allPosts]);

  const filterByCategory = useCallback(
    (posts) => {
      if (
        searchParams.get("category") &&
        allCategories.includes(searchParams.get("category"))
      ) {
        return findPostByCategory(posts, searchParams.get("category"));
      }
      return posts;
    },
    [allCategories, searchParams]
  );

  const filterByTag = useCallback(
    (posts) => {
      if (
        searchParams.get("tag") &&
        allTags.includes(searchParams.get("tag"))
      ) {
        return findPostByTag(posts, searchParams.get("tag"));
      }
      return posts;
    },
    [allTags, searchParams]
  );

  const filterByDraft = useCallback(
    (posts) => {
      if (searchParams.get("draft")) {
        const draftParams = searchParams.get("draft");
        if (draftParams === "only-draft") {
          return posts.filter(({ draft }) => draft === true);
        }
        if (draftParams === "only-published") {
          return posts.filter(({ draft }) => draft === false);
        }
      }
      return posts;
    },
    [searchParams]
  );

  const filterByTitle = useCallback(
    (posts) => {
      if (searchParams.get("title")) {
        return postTitleFilter(posts, searchParams.get("title"));
      }
      return posts;
    },
    [searchParams]
  );

  const filterByDate = useCallback(
    (posts) => {
      if (
        searchParams.get("date") &&
        checkDateParams(searchParams.get("date"))
      ) {
        return postDateFilter(
          posts,
          dateStringToArray(searchParams.get("date"))
        );
      }
      return posts;
    },
    [searchParams]
  );

  const filterByAuthor = useCallback(
    (posts) => {
      if (
        searchParams.get("author") &&
        allAuthors.includes(searchParams.get("author"))
      ) {
        return findPostByAuthor(posts, searchParams.get("author"));
      }
      return posts;
    },
    [searchParams, allAuthors]
  );

  let filteredPosts = useRef();

  const handlePagination = useCallback(() => {
    const end =
      filteredPosts.current.length > defaultPageSize
        ? defaultPageSize
        : filteredPosts.current.length;
    setCurrentPagePosts(filteredPosts.current.slice(0, end));
    setPaginationTotal(filteredPosts.current.length);
  }, []);

  const searchObj = useMemo(() => {
    const searchParamsCopy = {};
    for (const [key, value] of searchParams.entries()) {
      searchParamsCopy[key] = value;
    }
    return searchParamsCopy;
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess && message === "成功删除文章") {
      antMessage.success(message);
    }
  }, [isSuccess, message]);

  const [currentPagePosts, setCurrentPagePosts] = useState();
  const [paginationTotal, setPaginationTotal] = useState();

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPagePosts(filteredPosts.current.slice(start, end));
  };

  const onChangeSelectTag = (value) => {
    let filterResult = allPosts;
    filterResult = filterByCategory(filterResult);
    filterResult = filterByAuthor(filterResult);
    filterResult = filterByDraft(filterResult);
    filterResult = filterByTitle(filterResult);
    filterResult = filterByDate(filterResult);
    if (value && value === "all-tags") {
      filteredPosts.current = filterResult;
    } else {
      filterResult = findPostByTag(filterResult, value);
      filteredPosts.current = filterResult;
    }
    handlePagination();
    if (value && value !== "all-tags") {
      setSearchParams({ ...searchObj, tag: value });
    } else {
      delete searchObj.tag;
      setSearchParams({ ...searchObj });
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
            <Option key={tag} value={tag}>
              {tag}
            </Option>
          );
        })}
      </Select>
    </>
  );

  const onChangeSelectAuthor = (value) => {
    //console.log(`selected ${value}`);
    let filterResult = allPosts;
    filterResult = filterByCategory(filterResult);
    filterResult = filterByTag(filterResult);
    filterResult = filterByDraft(filterResult);
    filterResult = filterByTitle(filterResult);
    filterResult = filterByDate(filterResult);

    if (value === "all-authors") {
      filteredPosts.current = filterResult;
    } else {
      filterResult = findPostByAuthor(filterResult, value);
      filteredPosts.current = filterResult;
    }

    handlePagination();

    if (value && value !== "all-authors") {
      setSearchParams({ ...searchObj, author: value });
    } else {
      delete searchObj.author;
      setSearchParams({ ...searchObj });
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
    //console.log(`selected ${value}`);
    let filterResult = allPosts;
    filterResult = filterByTag(filterResult);
    filterResult = filterByAuthor(filterResult);
    filterResult = filterByDraft(filterResult);
    filterResult = filterByTitle(filterResult);
    filterResult = filterByDate(filterResult);

    if (value === "all-categories") {
      filteredPosts.current = filterResult;
    } else {
      filterResult = findPostByCategory(filterResult, value);
      filteredPosts.current = filterResult;
    }
    handlePagination();

    if (value && value !== "all-categories") {
      setSearchParams({ ...searchObj, category: value });
    } else {
      delete searchObj.category;
      setSearchParams({ ...searchObj });
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
        }} 
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
    filterResult = filterByCategory(filterResult);
    filterResult = filterByAuthor(filterResult);
    filterResult = filterByDraft(filterResult);
    filterResult = filterByTag(filterResult);
    filterResult = filterByDate(filterResult);

    if (value === "" || !value) {
      filteredPosts.current = filterResult;
      setIsTitleFiltered(false);
      delete searchObj.title;
      setSearchParams({ ...searchObj });
    } else {
      filterResult = postTitleFilter(filterResult, value);
      filteredPosts.current = filterResult;
      setIsTitleFiltered(true);
      setSearchParams({ ...searchObj, title: value });
    }
    handlePagination();
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
    const dateArray = dateString;

    let filterResult = allPosts;
    filterResult = filterByCategory(filterResult);
    filterResult = filterByAuthor(filterResult);
    filterResult = filterByDraft(filterResult);
    filterResult = filterByTitle(filterResult);
    filterResult = filterByTag(filterResult);

    if (value === null) {
      filteredPosts.current = filterResult;
      delete searchObj.date;
      setSearchParams({ ...searchObj });
    } else {
      filterResult = postDateFilter(filterResult, dateArray);
      filteredPosts.current = filterResult;
      setSearchParams({ ...searchObj, date: dateArrayToString(dateArray) });
    }
    handlePagination();
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
    const radioChecked = e.target.value;
    setRadioValue(e.target.value);
    let filterResult = allPosts;
    filterResult = filterByCategory(filterResult);
    filterResult = filterByAuthor(filterResult);
    filterResult = filterByTag(filterResult);
    filterResult = filterByTitle(filterResult);
    filterResult = filterByDate(filterResult);

    if (radioChecked === "only-draft") {
      filterResult = filterResult.filter(({ draft }) => draft === true);
      filteredPosts.current = filterResult;
    } else if (radioChecked === "only-published") {
      filterResult = filterResult.filter(({ draft }) => draft === false);
      filteredPosts.current = filterResult;
    } else if (radioChecked === "all-posts") {
      filteredPosts.current = filterResult;
    }
    handlePagination();

    if (radioChecked && radioChecked !== "all-posts") {
      setSearchParams({ ...searchObj, draft: radioChecked });
    } else {
      delete searchObj.draft;
      setSearchParams({ ...searchObj });
    }
  };

  const renderPostSelectDraft = (
    <>
      <span className={style["filter-label"]}>{`是否为草稿 : `}</span>
      <Radio.Group onChange={onChangeRadio} value={radioValue}>
        <Radio value={"all-posts"}>所有文章</Radio>
        <Radio value={"only-draft"}>仅草稿</Radio>
        <Radio value={"only-published"}>仅发布的文章</Radio>
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

  const onClickPreview = ({ postId }, e) => {
    setSearchParams({ preview: postId });
  };

  const onClickDelete = ({ postId }, e) => {
    postIdRef.current = postId;
    setIsModalVisible(true);
  };

  // 下载的md文件Front-matter符合Hexo格式,draft用于表示是否为草稿,不是hexo预先定义的.
  const downloadMD = ({ postId }, e) => {
    const currentPost = allPosts.find((post) => post.id === postId);
    let tagsString = "";
    currentPost.tags.forEach((tag) => {
      tagsString += "\n- " + tag;
    });
    const frontMatter = `---
title: ${currentPost.title}
date: ${currentPost.date}
updated: ${new Date(currentPost.updatedAt).toLocaleString()}
draft: ${currentPost.draft}
category: 
- ${currentPost.category}
tags:${tagsString}
---

`;
    const content = currentPost.content ?? "";
    const frontMatterLF = frontMatter.replace(/\r\n/g, "\n");
    const contentLF = content.replace(/\r\n/g, "\n");
    const mdBlob = new Blob([frontMatterLF, contentLF], { type: "text/plain" });
    fileDownload(mdBlob, currentPost.title + ".md");
  };

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

        {isTabletOrMobile ? null : <Divider className={style["divider-thin"]} />}
        <div className={style["grid-wrap"]}>
          {currentPagePosts?.length > 0 ? (
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
                      <p>
                        <span className={style["grey-label"]}>发布日期: </span>
                        {post.date}
                      </p>
                      <p>
                        <span className={style["grey-label"]}>作者: </span>
                        {post.authors.map((author, i) => (
                          <span key={i}>{`${author} `}</span>
                        ))}
                      </p>
                      {post.summary?(
                        <p>
                          <span className={style["grey-label"]}>简介: </span>
                          {post.summary}
                        </p>
                      ):null}
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
                      <button
                        onClick={(e) => onClickPreview({ postId: post.id }, e)}
                        className={style["preview-button"]}
                      >
                        <EyeOutlined />
                        {" 预览"}
                      </button>
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
                        onClick={(e) => downloadMD({ postId: post.id }, e)}
                        className={style["download-md-file-button"]}
                      >
                        <DownloadOutlined />
                        {" 下载.md文件"}
                      </button>
                    </div>
                  </div>
                  {isTabletOrMobile ? null : <Divider className={style["divider-thin"]} />}
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
    <HCenterSpin />
  );
}

export default PostSearch;
