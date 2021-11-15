import { useEffect, useState } from "react";
import { useParams, useMatch } from "react-router";
import { Feed, FeedFilter, NotFound, Pagination } from "../../components";

const Main = ({ limit = 5 }) => {
  const pageType = useMatch("/:page/*")?.params["page"];
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set(
      "Authorization",
      `${authToken === null ? undefined : `Token ${authToken}`}`
    );

    fetch("/api/v1/blog/post/", {
      method: "GET",
      headers: requestHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response.text());
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        setArticles(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const pagesCount = Math.ceil(articles.length / limit);
  const { pageNum } = useParams();

  let currentPage = 1;

  if (typeof pageNum === "string") {
    let convertedPageNum = parseInt(pageNum);

    if (
      isNaN(convertedPageNum) ||
      convertedPageNum < 1 ||
      convertedPageNum > pagesCount
    ) {
      return <NotFound />;
    } else {
      currentPage = convertedPageNum;
    }
  }

  return (
    <>
      <FeedFilter />
      {articles.length ? (
        <>
          <Feed articleList={articles} />
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            pageLink={pageType || "/"}
          />
        </>
      ) : (
        "no data"
      )}
    </>
  );
};

export default Main;
