import {
  AutoComplete,
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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultPageSize = 10;

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

  const allCategories = getAllCategories(allPosts);

  useEffect(() => {
    setPostUpdatedCategories(defaultPostCategories);
    if (allCategories.length > 0) {
      if (!searchParams.get("category")) {
        setSearchParams({ category: allCategories[0] }, { replace: true });
        //刷新页面
      } else if (!allCategories.includes(searchParams.get("category"))) {
        setSearchParams({ category: allCategories[0] }, { replace: true });
        //刷新页面
        const value = allCategories[0];
        const filterResult = findPostByCategory(allPosts, value);
        selectedPosts.current = filterResult;

        const end =
          selectedPosts.current.length > defaultPageSize
            ? defaultPageSize
            : selectedPosts.current.length;
        setCurrentPagePosts(selectedPosts.current.slice(0, end));
        setPaginationTotal(selectedPosts.current.length);
      } else {
        const value = searchParams.get("category");
        const filterResult = findPostByCategory(allPosts, value);
        selectedPosts.current = filterResult;

        const end =
          selectedPosts.current.length > defaultPageSize
            ? defaultPageSize
            : selectedPosts.current.length;
        setCurrentPagePosts(selectedPosts.current.slice(0, end));
        setPaginationTotal(selectedPosts.current.length);
      }
    } else {
      //setSearchParams({});
    }

    setSelectValue(() => {
      if (allCategories.length > 0) {
        if (searchParams.get("category")) {
          if (allCategories.includes(searchParams.get("category"))) {
            return searchParams.get("category");
          } else {
            return allCategories[0];
          }
        } else {
          return allCategories[0];
        }
      } else {
        return null;
      }
    });
  }, [allPosts]);

  let firstCPosts = [];
  if (allCategories.length > 0) {
    firstCPosts = findPostByCategory(allPosts, allCategories[0]);
  }

  const defaultPostCategories = allPosts.map((post) => {
    return { id: post.id, category: post.category };
  });
  const [postUpdatedCategories, setPostUpdatedCategories] = useState(
    defaultPostCategories
  );

  const [currentPagePosts, setCurrentPagePosts] = useState(
    firstCPosts.slice(0, defaultPageSize)
  );
  const [paginationTotal, setPaginationTotal] = useState(firstCPosts.length);
  let selectedPosts = useRef(firstCPosts);

  const onChangePage = (page, pageSize) => {
    const start = (page - 1) * defaultPageSize;
    const end = start + pageSize;
    setCurrentPagePosts(selectedPosts.current.slice(start, end));
  };

  const [selectValue, setSelectValue] = useState(null);

  const onChangeSelect = (value) => {
    setSelectValue(value);
    const filterResult = findPostByCategory(allPosts, value);
    selectedPosts.current = filterResult;

    const end =
      selectedPosts.current.length > defaultPageSize
        ? defaultPageSize
        : selectedPosts.current.length;
    setCurrentPagePosts(selectedPosts.current.slice(0, end));
    setPaginationTotal(selectedPosts.current.length);
    if (value) {
      setSearchParams({ category: value });
    }
  };

  const renderPostSelect = (
    <>
      <span>{`选择分类 : `}</span>
      <Select
        showSearch={!isTabletOrMobile}
        placeholder="选择分类"
        optionFilterProp="children"
        onChange={onChangeSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        className={style["item-select"]}
        value={selectValue}
      >
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

  const [modalText, setModalText] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const postIdRef = useRef("");

  const handleOk = () => {
    setIsModalVisible(false);
    const postUpdated = postUpdatedCategories.find(
      (p) => p.id === postIdRef.current
    );
    if (postUpdated && postUpdated.category !== "") {
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

  return (
    <>
      <div className={style["select-list-box"]}>
        <div className={style["select-header"]}>{renderPostSelect}</div>
        <Divider />

        {currentPagePosts.length > 0 ? (
          currentPagePosts.map((post, i) => {
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
                        <span key={i}>{`${author} `}</span>
                      ))}
                    </p>
                  </div>
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
  );
}

export default PostCategory;
