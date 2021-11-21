import "./Post.scss";

import { useContext } from "react";
import { Link } from "react-router-dom";

import UserInfo from "./UserInfo";
import Bookmark from "./Bookmark";
import Votes from "./Votes";
import DraftJSContent from "./DraftJSContent";

import { AuthContext } from "../App";

import IPost from "../interfaces/Post";

interface PostProps {
  postData?: IPost;
  link?: string;
}

const Post = ({ postData, link }: PostProps) => {
  const authContext = useContext(AuthContext);

  return (
    <article
      className={"post block" + (link ? " block-focus" : "")}
      tabIndex={0}
    >
      {postData ? (
        <>
          {authContext.user && authContext.user.id === postData.author?.id && (
            <Link to={`/post/${postData.id}/edit`}>edit</Link>
          )}
          <UserInfo author={postData.author} created_at={postData.created_at} />
          {link ? (
            <Link className="post__heading-link" to={`/post/${postData.id}`}>
              <h2 className="post__heading">{postData.header}</h2>
            </Link>
          ) : (
            <h2 className="post__heading">{postData.header}</h2>
          )}
          <DraftJSContent
            className="post__article-part"
            content={postData.content}
          />
          {link ? (
            <Link className="post__read-more btn" to={`/post/${postData.id}`}>
              Read more
            </Link>
          ) : (
            ""
          )}
          <div
            className={
              "post__article-data article-data" + (link ? "" : " paddingless")
            }
          >
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
