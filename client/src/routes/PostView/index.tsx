import { useEffect, useState } from "react";
import { useParams } from "react-router";

import CommentSection from "../../components/CommentSection";
import { Post } from "../../components";

import { promiseCopyPaste, getAuthTokenHeaders } from "../../utils";

const PostView = () => {
  const pageParams = useParams();
  const [postViewData, setPostViewData] = useState<any>();

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
          <Post
            postData={{
              bookmark_count: postViewData.bookmark_count,
              comment_count: postViewData.comment_count,
              content: postViewData.content,
              created_at: postViewData.created_at,
              upvotes: postViewData.upvotes,
              downvotes: postViewData.downvotes,
              header: postViewData.header,
              id: postViewData.id,
              is_bookmarked: postViewData.is_bookmarked,
              author: postViewData.author,
            }}
          />
          <CommentSection
            postID={postViewData.id}
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
