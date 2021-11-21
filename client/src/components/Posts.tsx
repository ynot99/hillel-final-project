import "./Posts.scss";
import "./Post.scss";

import IPost from "../interfaces/Post";
import { Post } from ".";

interface FeedProps {
  articleList: Array<IPost>;
}

const Posts = ({ articleList }: FeedProps) => {
  return (
    <ul className="feed-list">
      {articleList?.map((item) => {
        return (
          <li key={item.id} className="feed-list__item">
            <Post postData={item} link={`/post/${item.id}`} />
          </li>
        );
      })}
    </ul>
  );
};

export default Posts;
