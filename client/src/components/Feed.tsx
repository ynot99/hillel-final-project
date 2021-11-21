import { useState } from "react";

import { Posts, FeedFilter } from "./";

import IPost from "../interfaces/Post";
import PaginationPage from "./PaginationPage";

interface IFetchPosts {
  count: number;
  next: string;
  previous: string;
  results: Array<IPost>;
}

const Feed = ({ fetchURL = "" }) => {
  const [articles, setArticles] = useState<IFetchPosts>();

  return (
    <>
      <FeedFilter />
      <PaginationPage
        responseData={articles}
        setResponseData={setArticles}
        fetchURL={`/api/v1/blog/post/${fetchURL}`}
      >
        {articles?.count ? <Posts articleList={articles.results} /> : "no data"}
      </PaginationPage>
    </>
  );
};

export default Feed;
