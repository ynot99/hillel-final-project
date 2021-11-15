import "./Feed.scss";
import "./Post.scss";
import no_avatar from "../assets/img/no-user-image.gif";

import moment from "moment";
import { Link } from "react-router-dom";

import Bookmark from "./Bookmark";

interface FeedProps {
  articleList: Array<{
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
  }>;
}

const Feed = ({ articleList }: FeedProps) => {
  return (
    <ul className="feed-list">
      {articleList.map((item) => {
        const votes = item.upvotes - item.downvotes;
        const created_at = moment(item.created_at)
          .format("DD MMMM [at] hh:mm")
          .toString();
        return (
          <li
            key={item.id}
            className="feed-list__item block block-focus"
            tabIndex={0}
          >
            <article className="feed-list__post post">
              <div className="post__user-info user-info">
                <Link
                  className="user-info__profile"
                  to={`/profile/${item.author.id}`}
                >
                  <img
                    className="user-info__avatar"
                    src={item.author.avatar || no_avatar}
                    alt="avatar"
                  />
                  <span className="user-info__username">
                    {item.author.user.username}
                  </span>
                </Link>
                <span className="user-info__date">{created_at}</span>
              </div>
              <h2 className="post__heading">{item.header}</h2>
              <div className="post__article-part">
                <p className="post__paragraph">{item.content}</p>
              </div>
              <a className="post__read-more btn" href={`post/${item.id}`}>
                Read more
              </a>
              <div className="post__article-data article-data">
                <div className="article-data__item">
                  <span
                    className={
                      "article-data__number" +
                      (votes === 0 ? "" : votes > 0 ? " positive" : " negative")
                    }
                  >
                    rating: <span>{votes}</span>
                  </span>
                </div>
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
