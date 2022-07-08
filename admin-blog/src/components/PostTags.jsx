import {
  Divider,
  Empty,
  message as antMessage,
  Modal,
  Pagination,
  Select,
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "react-router-dom";
import style from "../css/PostTC.module.css";
import { getPosts, reset, updatePost } from "../features/posts/postSlice";

const { Option } = Select;

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

function findPostByTag(posts, tag) {
  return posts.filter(({ tags }) => tags.includes(tag));
}

function PostTags() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
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

  useEffect(() => {
    if (isSuccess && message === "文章已更改") {
      antMessage.success(message);
      dispatch(getPosts());
    }
  }, [isSuccess, message]);

  const allPosts = useMemo(
    () =>
      posts
        .filter(({ draft }) => draft === false)
        .map((post) => {
          return {
            id: post._id,
            date: new Date(post.createdAt).toLocaleString(),
            ...post,
          };
        }),
    [posts]
  );

  const allTags = getAllTags(allPosts);

  const reloadPageByTag = (value) => {
    const filterResult = findPostByTag(allPosts, value);
    selectedPosts = filterResult;
    const end =
      selectedPosts.length > defaultPageSize
        ? defaultPageSize
        : selectedPosts.length;
    setCurrentPagePosts(selectedPosts.slice(0, end));
    setPaginationTotal(selectedPosts.length);
  };

  useEffect(() => {
    setPostUpdatedTags(defaultPostTags);
    if (allTags.length > 0) {
      if (!searchParams.get("tag")) {
        setSearchParams({ tag: allTags[0] }, { replace: true });
        reloadPageByTag(allTags[0]);
      } else if (!allTags.includes(searchParams.get("tag"))) {
        setSearchParams({ tag: allTags[0] }, { replace: true });
        //刷新页面
        reloadPageByTag(allTags[0]);
      } else {
        reloadPageByTag(searchParams.get("tag"));
      }
    } else {
      //setSearchParams({});
    }

    //设置selectValue
    setSelectValue(() => {
      if (allTags.length > 0) {
        if (searchParams.get("tag")) {
          if (allTags.includes(searchParams.get("tag"))) {
            return searchParams.get("tag");
          } else {
            return allTags[0];
          }
        } else {
          return allTags[0];
        }
      } else {
        return null;
      }
    });
  }, [allPosts]);

  let firstTagPosts = [];
  if (allTags.length > 0) {
    firstTagPosts = findPostByTag(allPosts, allTags[0]);
  }

  const defaultPageSize = 10;

  const defaultPostTags = allPosts.map((post) => {
    return { id: post.id, tags: post.tags };
  });
  const [postUpdatedTags, setPostUpdatedTags] = useState(defaultPostTags);
  console.log("postUpdatedTags : ", postUpdatedTags);

  const [currentPagePosts, setCurrentPagePosts] = useState(
    firstTagPosts.slice(0, defaultPageSize)
  );
  const [paginationTotal, setPaginationTotal] = useState(firstTagPosts.length);
  let selectedPosts = firstTagPosts;

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPagePosts(selectedPosts.slice(start, end));
  };

  const [selectValue, setSelectValue] = useState(null);

  const onChangeSelect = (value) => {
    console.log(`selected ${value}`);
    setSelectValue(value);
    const filterResult = findPostByTag(allPosts, value);
    selectedPosts = filterResult;
    const end =
      selectedPosts.length > defaultPageSize
        ? defaultPageSize
        : selectedPosts.length;
    setCurrentPagePosts(selectedPosts.slice(0, end));
    setPaginationTotal(selectedPosts.length);
    if (value) {
      setSearchParams({ tag: value });
    }
  };

  const renderPostSelect = (
    <>
      <span>{`选择标签 : `}</span>
      <Select
        showSearch={!isTabletOrMobile}
        placeholder="选择标签"
        optionFilterProp="children"
        onChange={onChangeSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        className={style["item-select"]}
        value={selectValue}
      >
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

  const [modalText, setModalText] = useState("");
  const postIdRef = useRef("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
    const postUpdated = postUpdatedTags.find((p) => p.id === postIdRef.current);

    if (postUpdated && postUpdated.tags.length !== 0) {
      let postFormDate = new FormData();
      postUpdated.tags.forEach((tag) => {
        postFormDate.append("tags", tag);
      });
      postFormDate.append("postId", postIdRef.current);
      dispatch(updatePost(postFormDate));
      postIdRef.current = "";
    } else if (postUpdated && postUpdated.tags.length === 0) {
      let postFormDate = new FormData();
      postFormDate.append("tags", "");
      postFormDate.append("postId", postIdRef.current);
      dispatch(updatePost(postFormDate));
      postIdRef.current = "";
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleClickEdit = (e) => {
    e.target.contentEditable = true;
    e.target.focus();
  };

  const handleClickAdd = (e) => {
    e.target.contentEditable = true;
    e.target.focus();
    e.target.innerText = "";
  };

  const handleBlurEdit = ({ postId, tag }, e) => {
    e.target.contentEditable = false;
    const tagValue = e.target.innerText;
    console.log("handleBlurEdit tagValue: ", tagValue);
    let postUTCopy = JSON.parse(JSON.stringify(postUpdatedTags));
    console.log("handleBlurEdit postUTCopy: ", postUTCopy);
    const postIndex = postUpdatedTags.findIndex((p) => p.id === postId);
    console.log("handleBlurEdit postIndex: ", postIndex);
    if (tagValue) {
      const tagIndex = postUTCopy[postIndex].tags.findIndex((t) => t === tag);
      console.log("handleBlurEdit tagIndex: ", tagIndex);
      console.log(
        "handleBlurEdit postUTCopy[postIndex].tags[tagIndex]:",
        postUTCopy[postIndex].tags[tagIndex]
      );
      postUTCopy[postIndex].tags[tagIndex] = tagValue;
      setPostUpdatedTags(postUTCopy);
    } else {
      postUTCopy[postIndex].tags = postUTCopy[postIndex].tags.filter(
        (t) => t !== tag
      );
      setPostUpdatedTags(postUTCopy);
    }
  };

  const handleBlurAdd = ({ postId }, e) => {
    e.target.contentEditable = false;
    const tagValue = e.target.innerText;
    const postUTCopy = JSON.parse(JSON.stringify(postUpdatedTags));
    const postIndex = postUpdatedTags.findIndex((p) => p.id === postId);
    if (tagValue) {
      postUTCopy[postIndex].tags.push(tagValue);
      setPostUpdatedTags(postUTCopy);
    }
    e.target.innerText = "+";
  };

  const handleDeleteTag = ({ postId, tag }, e) => {
    const postUTCopy = postUpdatedTags.slice();
    const postIndex = postUpdatedTags.findIndex((p) => p.id === postId);
    postUTCopy[postIndex].tags = postUTCopy[postIndex].tags.filter(
      (t) => t !== tag
    );
    setPostUpdatedTags(postUTCopy);
  };

  const handleTagsUpdate = ({ postId }, e) => {
    postIdRef.current = postId;
    setModalText(`确认更改文章标签?`);
    setIsModalVisible(true);
  };

  const handleKDAdd = (e) => {
    if (e.code === "Enter") {
      e.target.blur();
    }
  };

  const handleKDEdit = (e) => {
    if (e.code === "Enter") {
      e.target.blur();
    }
  };

  return (
    <>
      <div className={style["select-list-box"]}>
        <div className={style["select-header"]}>{renderPostSelect}</div>
        <Divider />

        {currentPagePosts.length > 0 ? (
          currentPagePosts.map((post, i) => {
            const updatedPost = postUpdatedTags.find((p) => p.id === post.id);
            return (
              <div key={post.id}>
                <div className={style["list-item-wrap"]}>
                  <div className={style["list-left-box"]}>
                    <h1 className={style["post-title"]}>{post.title}</h1>
                    <p>
                      <span className={style["grey-label"]}>发布日期: </span>
                      {post.date}
                    </p>

                    <p>
                      <span className={style["grey-label"]}>作者: </span>
                      {post.authors.map((author, i) => (
                        <span key={author}>{`${author} `}</span>
                      ))}
                    </p>
                  </div>
                  <div className={style["list-middle-box"]}>
                    <span className={style["middle-box-label"]}>标签: </span>
                    <div className={style["inline-items-box"]}>
                      {updatedPost
                        ? updatedPost.tags.map((tag, i) => {
                            if (tag) {
                              return (
                                <span className={style["tag-box"]} key={tag}>
                                  <span
                                    //contentEditable={true}
                                    className={style["edit-item"]}
                                    onClick={handleClickEdit}
                                    onKeyDown={handleKDEdit}
                                    onBlur={(e) =>
                                      handleBlurEdit(
                                        { postId: post.id, tag: tag },
                                        e
                                      )
                                    }
                                  >
                                    {tag}
                                  </span>
                                  <span className={style["confirm-icon"]}>
                                    √
                                  </span>
                                  <span
                                    onClick={(e) =>
                                      handleDeleteTag(
                                        { postId: post.id, tag: tag },
                                        e
                                      )
                                    }
                                    className={style["delete-icon"]}
                                  >
                                    x
                                  </span>
                                </span>
                              );
                            } else {
                              return <span key={i}>ERROR!</span>;
                            }
                          })
                        : null}
                      <span
                        onClick={handleClickAdd}
                        onBlur={(e) => handleBlurAdd({ postId: post.id }, e)}
                        className={style["add-button"]}
                        onKeyDown={handleKDAdd}
                      >
                        +
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleTagsUpdate({ postId: post.id }, e)}
                    className={style["update-button"]}
                  >
                    更改标签
                  </button>
                </div>
                <Divider className={style["divider"]} />
              </div>
            );
          })
        ) : (
          <Empty />
        )}

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
        title="更改标签"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default PostTags;
