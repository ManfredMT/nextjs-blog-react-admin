import { Divider, Empty, message as antMessage, Modal, Pagination } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import style from "../css/PostTC.module.css";
import {
  getPosts,
  reset,
  updatePost,
  resetError,
} from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
import usePrevious from "../hooks/usePrevious";
import ArticleInfo from "./ArticleInfo";
import FilterSelectWrap from "./FilterSelectWrap";
import HCenterSpin from "./HCenterSpin";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, isLoadEnd, message } = useSelector(
    (state) => state.posts
  );

  useGetData(getPosts, reset, isError, message, resetError);

  useEffect(() => {
    if (isSuccess && message === "文章已更改") {
      antMessage.success(message);
      dispatch(getPosts());
    }
  }, [isSuccess, message, dispatch]);

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

  const allTags = useMemo(() => getAllTags(allPosts), [allPosts]);

  const reloadPageByTag = useCallback(
    (value) => {
      const filterResult = findPostByTag(allPosts, value);
      selectedPosts.current = filterResult;
      const end =
        selectedPosts.current.length > defaultPageSize
          ? defaultPageSize
          : selectedPosts.current.length;
      setCurrentPagePosts(selectedPosts.current.slice(0, end));
      setPaginationTotal(selectedPosts.current.length);
    },
    [allPosts]
  );

  const defaultPageSize = 10;

  const defaultPostTags = useMemo(
    () =>
      allPosts.map((post) => {
        return { id: post.id, tags: post.tags };
      }),
    [allPosts]
  );

  const [postUpdatedTags, setPostUpdatedTags] = useState();

  const [currentPagePosts, setCurrentPagePosts] = useState();
  const [paginationTotal, setPaginationTotal] = useState();
  let selectedPosts = useRef();

  useEffect(() => {
    setPostUpdatedTags(defaultPostTags);
    if (allTags.length > 0) {
      if (!searchParams.get("tag")) {
        setSearchParams({ tag: allTags[0] }, { replace: true });
        setSelectValue(allTags[0]);
      } else if (!allTags.includes(searchParams.get("tag"))) {
        setSearchParams({ tag: allTags[0] }, { replace: true });
        setSelectValue(allTags[0]);
      } else {
        reloadPageByTag(searchParams.get("tag"));
        setSelectValue(searchParams.get("tag"));
      }
    } else {
      setSelectValue(null);
    }
  }, [
    defaultPostTags,
    searchParams,
    setSearchParams,
    allTags,
    reloadPageByTag,
  ]);

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPagePosts(selectedPosts.current.slice(start, end));
  };

  const [selectValue, setSelectValue] = useState(null);

  const onChangeSelect = (value) => {
    setSelectValue(value);
    reloadPageByTag(value);
    if (value) {
      setSearchParams({ tag: value });
    }
  };

  const renderPostSelect = (
    <>
      <FilterSelectWrap
        label="选择标签"
        placeholder="选择标签"
        onChange={onChangeSelect}
        selectClass={style["item-select"]}
        selectValue={selectValue}
        allItems={allTags}
      />
    </>
  );

  const [modalText, setModalText] = useState("");
  const postIdRef = useRef("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
    const postUpdated = postUpdatedTags.find((p) => p.id === postIdRef.current);

    if (
      postUpdated &&
      postUpdated.tags.length !== 0 &&
      postIdRef.current !== ""
    ) {
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
    //防止点击空白处时触发编辑
    e.target.contentEditable = false;
    const tagValue = e.target.innerText;
    let postUTCopy = JSON.parse(JSON.stringify(postUpdatedTags));
    const postIndex = postUpdatedTags.findIndex((p) => p.id === postId);
    if (tagValue) {
      const tagIndex = postUTCopy[postIndex].tags.findIndex((t) => t === tag);
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
    //防止点击空白处时触发编辑
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
    const postUTCopy = JSON.parse(JSON.stringify(postUpdatedTags));
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

  const preIsLoadEnd = usePrevious(isLoadEnd);

  return isLoadEnd && preIsLoadEnd ? (
    <>
      <div className={style["select-list-box"]}>
        <div className={style["select-header"]}>{renderPostSelect}</div>
        <Divider />

        {currentPagePosts?.length > 0 ? (
          currentPagePosts.map((post, i) => {
            const updatedPost = postUpdatedTags.find((p) => p.id === post.id);
            return (
              <div key={post.id}>
                <div className={style["list-item-wrap"]}>
                  <ArticleInfo
                    boxClass={style["list-left-box"]}
                    titleClass={style["post-title"]}
                    title={post.title}
                    dateClass={style["grey-label"]}
                    date={post.date}
                    authorClass={style["grey-label"]}
                    authors={post.authors}
                  />
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
        <p className={style["end-info"]}>
          说明:请先编辑文章标签，然后点击'更改标签'按钮。
        </p>
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
  ) : (
    <HCenterSpin />
  );
}

export default PostTags;
