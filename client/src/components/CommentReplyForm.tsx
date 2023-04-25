import "./CommentForm.scss";

import { useState } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";

import { CustomEditor } from ".";
import { useDispatch } from "react-redux";
import { addPopup } from "../redux/popup/popupSlice";

const CommentReplyForm = ({
  commentID,
  postID,
  closeFunc,
  username,
}: {
  commentID: number;
  postID: number;
  closeFunc: Function;
  username: string;
}) => {
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
          reply_to: commentID,
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
        dispatch(addPopup("Something went wrong with your reply"));
      },
      () => {
        setIsLoading(false);
      }
    );
  };
  return (
    <div className="comment-form">
      <button
        className="comment-form__close"
        onClick={() => {
          closeFunc();
        }}
      >
        close
      </button>
      {!isSent ? (
        <>
          <div className="comment-form__form">
            <label className="comment-form__label">
              Reply to <span className="comment-form__blue">@{username}</span>
            </label>
            <CustomEditor content={comment} setContent={setComment} />
          </div>
          <button
            onClick={handleCommentSend}
            className="comment-form__submit btn4"
            disabled={!comment.getCurrentContent().hasText() || isLoading}
          >
            Reply
          </button>
        </>
      ) : (
        <p>Your reply is successfully sent!</p>
      )}{" "}
    </div>
  );
};

export default CommentReplyForm;
