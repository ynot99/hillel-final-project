import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Feed, FeedFilter, NotFound, Pagination } from "./";

import { promiseCopyPaste, getAuthTokenHeaders } from "../utils";

import IPost from "../interfaces/Post";

interface IFetchPosts {
  count: number;
  next: string;
  previous: string;
  results: Array<IPost>;
}

const Posts = ({ limit = 5, fetchURL = "" }) => {
  const { pageNum } = useParams();

  const [articles, setArticles] = useState<IFetchPosts | null>(null);

  let currentPage = pageNum ? parseInt(pageNum) : 1;
  let pagesCount = 1;

  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 1) return;

    promiseCopyPaste(
      fetch(
        `/api/v1/blog/post/${fetchURL}/?offset=${
          (currentPage - 1) * limit
        }&limit=${limit}`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            ...getAuthTokenHeaders(),
          }),
        }
      ),
      (result: any) => {
        window.scrollTo(0, 0);
        setArticles(result);
      }
    );
  }, [fetchURL, currentPage, limit]);

  if (articles) {
    pagesCount = Math.ceil(articles?.count / limit);
  }

  if (isNaN(currentPage) || currentPage < 1 || currentPage > pagesCount) {
    return <NotFound />;
  }

  return (
    <>
      <FeedFilter />
      {articles?.count ? (
        <>
          <Feed articleList={articles.results} />
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            prevPage={currentPage - 1 <= 0 ? null : currentPage - 1}
            nextPage={currentPage + 1 > pagesCount ? null : currentPage + 1}
          />
        </>
      ) : (
        "no data"
      )}
    </>
  );
};

export default Posts;
