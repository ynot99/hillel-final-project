import "./CommentSection.scss";

import UserInfo from "./UserInfo";
import Votes from "./Votes";
import CommentForm from "./CommentForm";

import IComment from "../interfaces/Comment";
import DraftJSContent from "./DraftJSContent";

const CommentSection = ({
  postID,
  comments,
}: {
  postID: number;
  comments: Array<IComment>;
}) => {
  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h2 className="comment-section__heading">
          Comments
          <span className="comment-section__heading-number">
            {comments.length}
          </span>
        </h2>
      </div>
      <ul className="comment-section__comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-section__comment">
            <UserInfo author={comment.user} created_at={comment.created_at} />
            <DraftJSContent
              className="comment-section__content"
              content={comment.content}
            />
            <div className="comment-section__footer">
              <Votes upvotes={comment.upvotes} downvotes={comment.downvotes} />
              <button className="comment-section__reply link">Reply</button>
            </div>
          </li>
        ))}
      </ul>
      <CommentForm postID={postID} />
    </div>
  );
};

export default CommentSection;
