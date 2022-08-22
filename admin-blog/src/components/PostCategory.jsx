import {
  AutoComplete,
  Divider,
  Empty,
  message as antMessage,
  Modal,
  Pagination,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import style from "../css/PostTC.module.css";
import { getPosts, reset, updatePost } from "../features/posts/postSlice";
import useGetData from "../hooks/useGetData";
import usePrevious from "../hooks/usePrevious";
import ArticleInfo from "./ArticleInfo";
import FilterSelectWrap from "./FilterSelectWrap";
import HCenterSpin from "./HCenterSpin";

function getAllCategories(posts) {
  let AllCategories = [];
  posts.forEach(({ category }) => {
    if (!AllCategories.includes(category)) {
      AllCategories.push(category);
    }
  });
  return AllCategories.sort();
}

function findPostByCategory(posts, c) {
  return posts.filter(({ category }) => category === c);
}

function PostCategory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultPageSize = 10;

  const dispatch = useDispatch();
  const { posts, isSuccess, isError, message } = useSelector(
    (state) => state.posts
  );

  console.log("PostCategory");
  useGetData(getPosts, reset, isError, message);

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

  const allCategories = useMemo(() => getAllCategories(allPosts), [allPosts]);

  const changeFilter = useCallback(
    (value) => {
      const filterResult = findPostByCategory(allPosts, value);
      selectedPosts.current = filterResult;
      const end =
        selectedPosts.current.length > defaultPageSize
          ? defaultPageSize
          : selectedPosts.current.length;
      console.log("fire setCurrentPagePosts");
      setCurrentPagePosts(selectedPosts.current.slice(0, end));
      setPaginationTotal(selectedPosts.current.length);
    },
    [allPosts]
  );

  const defaultPostCategories = useMemo(
    () =>
      allPosts.map((post) => {
        return { id: post.id, category: post.category };
      }),
    [allPosts]
  );
  const [postUpdatedCategories, setPostUpdatedCategories] = useState();
  const [currentPagePosts, setCurrentPagePosts] = useState();
  const [paginationTotal, setPaginationTotal] = useState();

  let selectedPosts = useRef();

  useEffect(() => {
    setPostUpdatedCategories(defaultPostCategories);
    if (allCategories.length > 0) {
      if (!searchParams.get("category")) {
        //设置URL参数
        setSearchParams({ category: "default" }, { replace: true });
        //设置选中的分类
        setSelectValue("default");
      } else if (!allCategories.includes(searchParams.get("category"))) {
        //设置URL参数
        setSearchParams({ category: "default" }, { replace: true });
        //设置选中的分类
        setSelectValue("default");
      } else {
        //刷新页面
        changeFilter(searchParams.get("category"));
        //设置选中的分类
        setSelectValue(searchParams.get("category"));
      }
    } else {
      setSelectValue(null);
    }
  }, [
    allCategories,
    changeFilter,
    defaultPostCategories,
    searchParams,
    setSearchParams,
  ]);

  console.log("currentPagePosts: ", currentPagePosts);

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPagePosts(selectedPosts.current.slice(start, end));
  };

  const [selectValue, setSelectValue] = useState(null);

  const onChangeSelect = (value) => {
    setSelectValue(value);
    changeFilter(value);
    if (value) {
      setSearchParams({ category: value });
    }
  };

  const renderPostSelect = (
    <>
      <FilterSelectWrap
        label="选择分类"
        placeholder="选择分类"
        onChange={onChangeSelect}
        selectClass={style["item-select"]}
        selectValue={selectValue}
        allItems={allCategories}
      />
    </>
  );

  const [modalText, setModalText] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const postIdRef = useRef("");

  const handleOk = () => {
    setIsModalVisible(false);
    const postUpdated = postUpdatedCategories.find(
      (p) => p.id === postIdRef.current
    );
    if (
      postUpdated &&
      postUpdated.category !== "" &&
      postIdRef.current !== ""
    ) {
      let postFormDate = new FormData();
      postFormDate.append("category", postUpdated.category);
      postFormDate.append("postId", postIdRef.current);
      dispatch(updatePost(postFormDate));
      postIdRef.current = "";
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeCategory = ({ postId }, value) => {
    const postUCCopy = postUpdatedCategories.slice();
    const postIndex = postUpdatedCategories.findIndex((p) => p.id === postId);
    postUCCopy[postIndex].category = value;
    setPostUpdatedCategories(postUCCopy);
  };

  const handleCategoryUpdate = ({ postId }, e) => {
    const postUpdated = postUpdatedCategories.find((p) => p.id === postId);
    if (postUpdated.category !== "") {
      postIdRef.current = postId;
      setModalText(`确认更改文章分类?`);
      setIsModalVisible(true);
    } else {
    }
  };

  const options = allCategories.map((c) => {
    return { value: c };
  });

  const preIsSuccess = usePrevious(isSuccess);

  return isSuccess && preIsSuccess ? (
    <>
      <div className={style["select-list-box"]}>
        <div className={style["select-header"]}>{renderPostSelect}</div>
        <Divider />

        {currentPagePosts?.length > 0 ? (
          currentPagePosts.map((post, i) => {
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
                  <div className={style["list-middle-box-c"]}>
                    <span className={style["middle-box-label"]}>分类: </span>
                    <div className={style["inline-items-box"]}>
                      <AutoComplete
                        allowClear
                        options={options}
                        style={{
                          width: 200,
                        }}
                        status={
                          postUpdatedCategories.find((p) => p.id === post.id)
                            ?.category === ""
                            ? "error"
                            : null
                        }
                        value={
                          postUpdatedCategories.find((p) => p.id === post.id)
                            ?.category
                        }
                        onChange={(value) =>
                          onChangeCategory({ postId: post.id }, value)
                        }
                        className={style["item-select"]}
                      />
                    </div>
                  </div>
                  <button
                    onClick={(e) =>
                      handleCategoryUpdate({ postId: post.id }, e)
                    }
                    className={style["update-button"]}
                  >
                    更改分类
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
          说明:请先修改文章分类，然后点击'更改分类'按钮。
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
        title="更改分类"
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

export default PostCategory;
