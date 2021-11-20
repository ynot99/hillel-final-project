import "./Post.scss";

import IPost from "../interfaces/Post";
import UserInfo from "./UserInfo";
import Bookmark from "./Bookmark";
import Votes from "./Votes";
import DraftJSContent from "./DraftJSContent";

interface PostProps {
  postData?: IPost;
}

const Post = ({ postData }: PostProps) => {
  return (
    <article className="post block">
      {postData ? (
        <>
          <UserInfo author={postData.author} created_at={postData.created_at} />
          <h2 className="post__heading">{postData.header}</h2>
          <DraftJSContent
            className="post__article-part"
            content={postData.content}
          />
          <div className="post__article-data article-data paddingless">
            <Votes upvotes={postData.upvotes} downvotes={postData.downvotes} />
            <div className="article-data__item">
              <span className="article-data__number">
                comments: <span>{postData.comment_count}</span>
              </span>
            </div>
            <Bookmark
              id={postData.id}
              isActive={postData.is_bookmarked}
              count={postData.bookmark_count}
            />
          </div>
        </>
      ) : (
        <p>loading...</p>
      )}
    </article>
  );
};

export default Post;
