import "./Comments.scss";

import { useState } from "react";

import Comment from "./Comment";

import IComment from "../interfaces/Comment";
import PaginationPage from "./PaginationPage";
import { Link } from "react-router-dom";

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
            <li className="comments__item" key={item.id}>
              <div className="comments__header">
                <Link
                  className="comments__link"
                  to={`/post/view/${item.post.id}`}
                >
                  <h2 className="comments__heading">{item.post.header}</h2>
                </Link>
                <hr className="comments__hr" />
              </div>
              <Comment commentData={item} />
            </li>
          );
        })}
      </ul>
    </PaginationPage>
  );
};

export default Comments;
