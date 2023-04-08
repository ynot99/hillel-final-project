import "./Post.scss";

import { Link } from "react-router-dom";

import UserInfo from "./UserInfo";
import Bookmark from "./Bookmark";
import Votes from "./Votes";
import DraftJSContent from "./DraftJSContent";

import IPost from "../interfaces/Post";
import { useAppSelector } from "../redux/hooks";
import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPopup } from "../redux/popup/popupSlice";

interface PostProps {
  postData?: IPost;
  link?: string;
}

const Post = ({ postData, link }: PostProps) => {
  const user = useAppSelector((state) => state.userauth.user);
  const [deleted, setDeleted] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (!window.confirm("Are you sure about deleting this post?")) {
      return;
    }
    promiseCopyPaste(
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/blog/post/auth/${postData?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getAuthTokenHeaders(),
          },
        }
      ),
      (result: any) => {
        setDeleted(true);
      },
      (err: any) => {
        dispatch(addPopup("Post is not deleted!"));
      }
    );
  };
  return (
    <article
      className={"post block" + (link ? " block-focus" : "")}
      tabIndex={0}
    >
      {!deleted ? (
        postData ? (
          <>
            {user && user.id === postData.author?.id && (
              <div className="post__actions">
                <Link
                  className="post__action link"
                  to={`/post/edit/${postData.id}`}
                >
                  edit
                </Link>
                <button className="post__action link" onClick={handleDelete}>
                  delete
                </button>
              </div>
            )}
            <UserInfo
              author={postData.author}
              created_at={postData.created_at}
            />
            {link ? (
              <Link
                className="post__heading-link"
                to={`/post/view/${postData.id}`}
              >
                <h2 className="post__heading">{postData.header}</h2>
              </Link>
            ) : (
              <h2 className="post__heading">{postData.header}</h2>
            )}
            <DraftJSContent
              className="post__article-part"
              content={postData.content}
            />
            {link && (
              <Link
                className="post__read-more btn"
                to={`/post/view/${postData.id}`}
              >
                Read more
              </Link>
            )}
            <div
              className={
                "post__article-data article-data" + (link ? "" : " paddingless")
              }
            >
              <Votes
                isUpvoted={postData.is_upvote}
                rating={postData.rating}
                postURL="rating/post/"
                body={{ post: postData.id }}
                isRatingBtnsVisible={link ? false : true}
              />
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
        )
      ) : (
        <p>Post is deleted</p>
      )}
    </article>
  );
};

export default Post;
