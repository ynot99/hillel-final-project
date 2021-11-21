import "./Comment.scss";

import { Link } from "react-router-dom";

import Votes from "./Votes";
import DraftJSContent from "./DraftJSContent";
import UserInfo from "./UserInfo";
import IComment from "../interfaces/Comment";

const Comment = ({ commentData }: { commentData: IComment }) => {
  return (
    <div className="comment block">
      {commentData.post ? (
        <>
          <Link className="comment__link" to={`/post/${commentData.post.id}`}>
            <h2 className="comment__heading">{commentData.post.header}</h2>
          </Link>
          <hr className="comment__hr" />
        </>
      ) : (
        ""
      )}
      <UserInfo author={commentData.user} created_at={commentData.created_at} />
      <DraftJSContent content={commentData.content} />
      <div className="comment__info">
        <Votes
          downvotes={commentData.downvotes}
          upvotes={commentData.upvotes}
        />
        {commentData.post ? (
          <button className="comment-section__reply link">Look</button>
        ) : (
          <button className="comment-section__reply link">Reply</button>
        )}
      </div>
    </div>
  );
};

export default Comment;
