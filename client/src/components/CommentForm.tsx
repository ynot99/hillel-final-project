import "./CommentForm.scss";

import { useState } from "react";
import { Link } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";

import { CustomEditor } from ".";
import { promiseCopyPaste, getAuthTokenHeaders } from "../utils";
import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { addPopup } from "../redux/popup/popupSlice";

const CommentForm = ({ postID }: { postID: number }) => {
  const user = useAppSelector((state) => state.userauth.user);
  const [comment, setComment] = useState(() => EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const dispatch = useDispatch();

  const handleCommentSend = (e: any) => {
    const raw = convertToRaw(comment.getCurrentContent());
    setIsLoading(true);

    promiseCopyPaste(
      fetch("/api/v1/blog/comment/", {
        method: "POST",
        body: JSON.stringify({
          post: postID,
          content: JSON.stringify(raw),
          reply_to: null,
        }),
        headers: new Headers({
          ...getAuthTokenHeaders(),
          "Content-Type": "application/json",
        }),
      }),
      (result: any) => {
        setIsSent(true);
      },
      (err: any) => {
        dispatch(addPopup("Something went wrong with your comment"));
      },
      () => {
        setIsLoading(false);
      }
    );
  };
  return (
    <>
      {user ? (
        <div className="comment-form">
          {!isSent ? (
            <>
              <div className="comment-form__form">
                <label className="comment-form__label">Leave a comment</label>
                <CustomEditor content={comment} setContent={setComment} />
              </div>
              <button
                onClick={handleCommentSend}
                className="comment-form__submit btn4"
                disabled={!comment.getCurrentContent().hasText() || isLoading}
              >
                Send
              </button>
            </>
          ) : (
            <p>Comment is successfully sent!</p>
          )}
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
