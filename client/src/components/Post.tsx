import "./Post.scss";
import no_avatar from "../assets/img/no-user-image.gif";

import moment from "moment";
import { Link } from "react-router-dom";

import Bookmark from "./Bookmark";

interface PostProps {
  postData:
    | {
        id: number;
        header: string;
        author: { id: number; user: { username: string }; avatar: string };
        content: string;
        upvotes: number;
        downvotes: number;
        created_at: Date;
        is_bookmarked: boolean;
        bookmark_count: number;
        comment_count: number;
      }
    | undefined;
}

const Post = ({ postData }: PostProps) => {
  return (
    <article className="post block">
      {postData ? (
        <>
          <div className="post__user-info user-info">
            <Link
              className="user-info__profile"
              to={`/profile/${postData.author.id}`}
            >
              <img
                className="user-info__avatar"
                src={postData.author.avatar || no_avatar}
                alt="avatar"
              />
              <span className="user-info__username">
                {postData.author.user.username}
              </span>
            </Link>
            <span className="user-info__date">
              {moment(postData.created_at)
                .format("DD MMMM [at] hh:mm")
                .toString()}
            </span>
          </div>
          <h2 className="post__heading">{postData.header}</h2>
          <div className="post__article-part">
            <p className="post__paragraph">{postData.content}</p>
          </div>
          <div className="post__article-data article-data">
            <div className="article-data__item">
              <span className="article-data__number positive">
                rating: <span>{postData.upvotes - postData.downvotes}</span>
              </span>
            </div>
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
