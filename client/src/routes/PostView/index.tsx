import { useEffect, useState } from "react";
import { useParams } from "react-router";

import CommentSection from "../../components/CommentSection";
import { Post } from "../../components";

import { promiseCopyPaste, getAuthTokenHeaders } from "../../utils";

import IComment from "../../interfaces/Comment";
import IPost from "../../interfaces/Post";

const PostView = () => {
  const pageParams = useParams();
  const [postViewData, setPostViewData] =
    useState<{ post: IPost; comments: Array<IComment> }>();

  useEffect(() => {
    promiseCopyPaste(
      fetch(`/api/v1/blog/post/${pageParams["postNum"]}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
      }),
      (result: any) => {
        setPostViewData(result);
      }
    );
  }, [pageParams]);
  return (
    <>
      {postViewData ? (
        <>
          <Post postData={postViewData.post} />
          <CommentSection
            postID={postViewData.post.id}
            comments={postViewData.comments}
          />
        </>
      ) : (
        "no data"
      )}
    </>
  );
};

export default PostView;
