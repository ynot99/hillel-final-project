import "./Feed.scss";
import "./Post.scss";

import { Link } from "react-router-dom";

import Bookmark from "./Bookmark";

import IPost from "../interfaces/Post";
import UserInfo from "./UserInfo";
import Votes from "./Votes";
import DraftJSContent from "./DraftJSContent";

interface FeedProps {
  articleList: Array<IPost>;
}

const Feed = ({ articleList }: FeedProps) => {
  return (
    <ul className="feed-list">
      {articleList.map((item) => {
        return (
          <li
            key={item.id}
            className="feed-list__item block block-focus"
            tabIndex={0}
          >
            <article className="feed-list__post post">
              <UserInfo author={item.author} created_at={item.created_at} />
              <Link className="post__heading-link" to={`/post/${item.id}`}>
                <h2 className="post__heading">{item.header}</h2>
              </Link>
              <DraftJSContent
                className="post__article-part"
                content={item.content}
              />
              <Link className="post__read-more btn" to={`/post/${item.id}`}>
                Read more
              </Link>
              <div className="post__article-data article-data">
                <Votes upvotes={item.upvotes} downvotes={item.downvotes} />
                <div className="article-data__item">
                  <span className="article-data__number">
                    comments: <span>{item.comment_count}</span>
                  </span>
                </div>
                <Bookmark
                  id={item.id}
                  isActive={item.is_bookmarked}
                  count={item.bookmark_count}
                />
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
};

export default Feed;
