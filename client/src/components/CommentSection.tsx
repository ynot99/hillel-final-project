import "./CommentSection.scss";

import { useState } from "react";

import CommentForm from "./CommentForm";
import Comment from "./Comment";

import IComment from "../interfaces/Comment";
import CommentReplyForm from "./CommentReplyForm";
import Replies from "./Replies";

const CommentSection = ({
  postID,
  comments,
  commentCount,
}: {
  postID: number;
  comments: Array<IComment>;
  commentCount: number;
}) => {
  const [commentFormID, setCommentFormID] = useState<number | null>(null);

  const commentFormIDHandler = (commentID: number) => {
    if (commentID === commentFormID) {
      setCommentFormID(null);
      return false;
    }
    setCommentFormID(commentID);
    return true;
  };

  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h2 className="comment-section__heading">
          Comments
          <span className="comment-section__heading-number">
            {commentCount}
          </span>
        </h2>
      </div>
      <ul className="comment-section__comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-section__comment">
            <Comment
              commentFormID={commentFormID}
              setCommentFormID={commentFormIDHandler}
              commentData={comment}
            />
            {commentFormID === comment.id && (
              <CommentReplyForm
                closeFunc={() => {
                  setCommentFormID(null);
                }}
                postID={postID}
                commentID={comment.id}
                username={comment.user.username}
              />
            )}
            {comment.reply_count ? (
              <Replies
                commentFormID={commentFormID}
                setCommentFormID={setCommentFormID}
                commentID={comment.id}
                postID={postID}
                replyCount={comment.reply_count}
              />
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
      {commentFormID === null && <CommentForm postID={postID} />}
    </div>
  );
};

export default CommentSection;
