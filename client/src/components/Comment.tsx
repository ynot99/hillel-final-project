import "./Comment.scss";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

import Votes from "./Votes";
import UserInfo from "./UserInfo";
import IComment from "../interfaces/Comment";
import { useAppSelector } from "../redux/hooks";
import { addPopup, unauthorized } from "../redux/popup/popupSlice";
import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";
import { CustomEditor } from ".";

const Comment = ({
  commentData,
  commentFormID,
  setCommentFormID,
}: {
  commentData: IComment;
  commentFormID?: number | null;
  setCommentFormID?: (commentID: number) => boolean;
}) => {
  const [deleted, setDeleted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(commentData.content))
    )
  );
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.userauth.user);

  const handleEdit = () => {
    promiseCopyPaste(
      fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/blog/comment/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        },
        body: JSON.stringify({
          id: commentData.id,
          content: JSON.stringify(convertToRaw(content.getCurrentContent())),
        }),
      }),
      (result: any) => {
        setIsEditMode(false);
      },
      (err: any) => {
        dispatch(addPopup("Something went wrong with your edit!"));
      }
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure about deleting this comment?")) {
      return;
    }
    promiseCopyPaste(
      fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/blog/comment/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        },
        body: JSON.stringify({ id: commentData.id }),
      }),
      (result: any) => {
        setDeleted(true);
      },
      (err: any) => {
        dispatch(addPopup("Comment is not deleted!"));
      }
    );
  };

  return (
    <div className="comment block">
      {deleted ? (
        <p>Comment is deleted</p>
      ) : (
        <>
          {!isEditMode && user && user.id === commentData.user.id && (
            <div className="post__actions">
              <button
                className="post__action link"
                onClick={() => {
                  setIsEditMode(true);
                }}
              >
                edit
              </button>
              <button className="post__action link" onClick={handleDelete}>
                delete
              </button>
            </div>
          )}
          <UserInfo
            author={commentData.user}
            created_at={commentData.created_at}
          />
          {isEditMode ? (
            <div className="comment__edit-mode">
              <button
                className="comment__close-btn"
                onClick={() => {
                  setIsEditMode(false);
                }}
              >
                close
              </button>
              <CustomEditor content={content} setContent={setContent} />
              <button
                className="comment__edit-btn btn3"
                onClick={() => {
                  handleEdit();
                }}
              >
                Edit
              </button>
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: draftToHtml(convertToRaw(content.getCurrentContent())),
              }}
            />
          )}
          <div className="comment__info">
            <Votes
              isUpvoted={commentData.is_upvote}
              rating={commentData.rating}
              postURL="rating/comment/"
              body={{ comment: commentData.id }}
              isRatingBtnsVisible={true}
            />

            {/* TODO "Look" link */}
            {/* <Link
              className="comment-section__reply link"
              to={`/post/view/${commentData.post.id}`}
              >
              Look
              </Link> */}

            {!commentData.post && commentFormID !== commentData.id && (
              <button
                onClick={() => {
                  if (!user) {
                    dispatch(unauthorized());
                    return;
                  }
                  if (setCommentFormID) {
                    setCommentFormID(commentData.id);
                  }
                }}
                className="comment-section__reply unstyled-btn link"
              >
                Reply
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
