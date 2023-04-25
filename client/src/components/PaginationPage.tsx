import React, { useEffect } from "react";
import { useParams } from "react-router";

import { NotFound, Pagination } from ".";
import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";

const PaginationPage = ({
  responseData,
  setResponseData,
  limit = 5,
  fetchURL = "",
  children,
}: {
  responseData: any | undefined;
  setResponseData: React.Dispatch<React.SetStateAction<any | undefined>>;
  limit?: number;
  fetchURL: string;
  children?: Object;
}) => {
  const { pageNum } = useParams();

  let currentPage = pageNum ? parseInt(pageNum) : 1;
  let pagesCount = 1;
  // let childrenWithProps;

  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 1) return;

    if (fetchURL[fetchURL.length - 1] !== "/") fetchURL += "/";

    promiseCopyPaste(
      fetch(`${fetchURL}?limit=${limit}&offset=${(currentPage - 1) * limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        },
      }),
      (result: PaginationResponse<any>) => {
        window.scrollTo(0, 0);
        setResponseData(result);
      }
    );
  }, [fetchURL, currentPage, limit, setResponseData]);

  if (responseData) {
    pagesCount = Math.ceil(responseData.count / limit);

    // childrenWithProps = React.Children.map(children, (child, index) => {
    //   // Checking isValidElement is the safe way and avoids a typescript
    //   // error too.
    //   if (React.isValidElement(child)) {
    //     return React.cloneElement(child as React.ReactElement<any>, {
    //       data: responseData.results,
    //     });
    //   }
    //   return child;
    // });
  }

  if (isNaN(currentPage) || currentPage < 1 || currentPage > pagesCount) {
    return <NotFound />;
  }

  return (
    <>
      {children}
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        prevPage={currentPage - 1 <= 0 ? null : currentPage - 1}
        nextPage={currentPage + 1 > pagesCount ? null : currentPage + 1}
      />
    </>
  );
};

export default PaginationPage;
