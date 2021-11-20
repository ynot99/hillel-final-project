import "./CommentForm.scss";

import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";

import { CustomEditor } from ".";
import { promiseCopyPaste, getAuthTokenHeaders } from "../utils";

const CommentForm = ({ postID }: { postID: number }) => {
  const [comment, setComment] = useState(() => EditorState.createEmpty());

  const handleCommentSend = (e: any) => {
    const raw = convertToRaw(comment.getCurrentContent());

    promiseCopyPaste(
      fetch("/api/v1/blog/post/comment/create", {
        method: "POST",
        body: JSON.stringify({
          post: postID,
          content: JSON.stringify(raw),
          // TODO implement replies
          reply_to: null,
        }),
        headers: new Headers({
          ...getAuthTokenHeaders(),
          "Content-Type": "application/json",
        }),
      }),
      (result: any) => {
        console.log(result);
      }
    );
  };
  return (
    <div className="comment-form">
      <div className="comment-form__form">
        <label className="comment-form__label">Leave a comment</label>
        <CustomEditor content={comment} setContent={setComment} />
      </div>
      <button
        onClick={handleCommentSend}
        className="comment-form__submit btn4"
        // disabled
      >
        Send
      </button>
    </div>
  );
};

export default CommentForm;
