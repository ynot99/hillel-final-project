import "./Posts.scss";

import { useState } from "react";

import { Post } from ".";
import PaginationPage from "./PaginationPage";

import IPost from "../interfaces/Post";

interface IFetchPosts {
  count: number;
  next: string;
  previous: string;
  results: Array<IPost>;
}

const Posts = ({ fetchURL }: { fetchURL: string }) => {
  const [articles, setArticles] = useState<IFetchPosts>();

  return (
    <PaginationPage
      responseData={articles}
      setResponseData={setArticles}
      fetchURL={`/api/v1/blog/post/${fetchURL}`}
    >
      <ul className="feed-list">
        {articles?.results.map((item) => {
          return (
            <li key={item.id} className="feed-list__item">
              <Post postData={item} link={`/post/${item.id}`} />
            </li>
          );
        })}
      </ul>
    </PaginationPage>
  );
};

export default Posts;
