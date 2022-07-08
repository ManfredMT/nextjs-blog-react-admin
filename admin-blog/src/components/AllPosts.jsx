import React from 'react';
import {useSearchParams} from "react-router-dom";
import PostEdit from "./PostEdit";
import PostPreview from "./PostPreview";
import PostSearch from "./PostSearch"

function AllPosts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const previewParams = searchParams.get('preview');
  const editParams = searchParams.get('edit');
  if(previewParams) {
    return <PostPreview />;
  }
  if(editParams) {
    return <PostEdit />;
  }

  return (
     <PostSearch />
  )
}

export default AllPosts