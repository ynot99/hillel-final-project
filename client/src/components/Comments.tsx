import "./Comments.scss";

import { useState } from "react";

import Comment from "./Comment";

import IComment from "../interfaces/Comment";
import PaginationPage from "./PaginationPage";

const Comments = ({ profileID }: { limit?: number; profileID: number }) => {
  const [comments, setComments] = useState<PaginationResponse<IComment>>();

  return (
    <PaginationPage
      responseData={comments}
      setResponseData={setComments}
      fetchURL={`/api/v1/blog/comment/user/${profileID}`}
    >
      <ul className="comments">
        {comments?.results.map((item) => {
          return (
            <li className="comments__item block" key={item.id}>
              <Comment commentData={item} />
            </li>
          );
        })}
      </ul>
    </PaginationPage>
  );
};

export default Comments;
