import "./Comments.scss";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { promiseCopyPaste } from "../utils";
import Votes from "./Votes";
import DraftJSContent from "./DraftJSContent";
import UserInfo from "./UserInfo";

const Comments = () => {
  const [comments, setComments] = useState<
    PaginationResponse<{
      id: number;
      user: {
        id: number;
        slug: string;
        avatar: string;
        user: { username: string };
      };
      content: string;
      post: { id: number; header: string };
      upvotes: number;
      downvotes: number;
      created_at: Date;
    }>
  >();

  useEffect(() => {
    promiseCopyPaste(
      fetch("/api/v1/blog/comment/user/8", {
        method: "GET",
      }),
      (result: any) => {
        console.log(result);
        setComments(result);
      }
    );
  }, []);

  return (
    <ul className="comments">
      {comments?.results.map((item) => {
        return (
          <li className="comments__item block" key={item.id}>
            <Link className="comments__link" to={`/post/${item.post.id}`}>
              <h2 className="comments__heading">{item.post.header}</h2>
            </Link>
            <hr className="comments__hr" />
            <UserInfo author={item.user} created_at={item.created_at} />
            <DraftJSContent content={item.content} />
            <div className="comments__info">
              <Votes downvotes={item.downvotes} upvotes={item.upvotes} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Comments;
