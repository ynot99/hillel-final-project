import "./CommentSection.scss";

import CommentForm from "./CommentForm";
import Comment from "./Comment";

import IComment from "../interfaces/Comment";

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
            <Comment commentData={comment} />
          </li>
        ))}
      </ul>
      <CommentForm postID={postID} />
    </div>
  );
};

export default CommentSection;
