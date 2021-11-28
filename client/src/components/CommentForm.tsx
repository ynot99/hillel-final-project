import "./CommentForm.scss";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";

import { CustomEditor } from ".";
import { promiseCopyPaste, getAuthTokenHeaders } from "../utils";
import { AuthContext } from "../App";

const CommentForm = ({ postID }: { postID: number }) => {
  const authContext = useContext(AuthContext);
  const [comment, setComment] = useState(() => EditorState.createEmpty());

  const handleCommentSend = (e: any) => {
    const raw = convertToRaw(comment.getCurrentContent());

    promiseCopyPaste(
      fetch("/api/v1/blog/comment/", {
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
    <>
      {authContext.user ? (
        <div className="comment-form">
          <div className="comment-form__form">
            <label className="comment-form__label">Leave a comment</label>
            <CustomEditor content={comment} setContent={setComment} />
          </div>
          <button
            onClick={handleCommentSend}
            className="comment-form__submit btn4"
            disabled={!comment.getCurrentContent().hasText()}
          >
            Send
          </button>
        </div>
      ) : (
        <div className="block">
          You need to{" "}
          <Link style={{ fontSize: "1rem" }} className="link" to="/login">
            Log in
          </Link>{" "}
          to be able to leave a comment
        </div>
      )}
    </>
  );
};

export default CommentForm;
