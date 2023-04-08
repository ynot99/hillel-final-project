import { useState } from "react";

import Comment from "./Comment";

import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";

import IComment from "../interfaces/Comment";
import CommentReplyForm from "./CommentReplyForm";

const Replies = ({
  commentID,
  postID,
  replyCount,
  commentFormID,
  setCommentFormID,
}: {
  commentID: number;
  postID: number;
  replyCount: number;
  commentFormID: number | null;
  setCommentFormID: Function;
}) => {
  // TODO TOO MANY COPY/PASTE
  const [replies, setReplies] = useState<Array<IComment>>([]);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);

  const commentFormIDHandler = (commentID: number) => {
    if (commentID === commentFormID) {
      setCommentFormID(null);
      return false;
    }
    setCommentFormID(commentID);
    return true;
  };

  const showMoreHandler = (commentID: number) => {
    if (replies.length) {
      setIsRepliesVisible(!isRepliesVisible);
      return;
    }

    promiseCopyPaste(
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/blog/comment/reply_to/${commentID}`,
        {
          headers: {
            ...getAuthTokenHeaders(),
          },
        }
      ),
      (result: Array<IComment>) => {
        setReplies(result);
        setIsRepliesVisible(true);
      }
    );
  };
  return (
    <>
      <button
        className="show-more link"
        onClick={() => {
          showMoreHandler(commentID);
        }}
      >
        {isRepliesVisible ? `Hide` : `Show`}
        {replyCount === 1 ? ` ${replyCount} reply` : ` ${replyCount} replies`}
      </button>
      {isRepliesVisible && (
        <ul className="reply-list">
          {replies.map((reply) => {
            return (
              <li className="reply-list__item" key={reply.id}>
                <Comment
                  commentFormID={commentFormID}
                  setCommentFormID={commentFormIDHandler}
                  commentData={reply}
                />

                {commentFormID === reply.id && (
                  <CommentReplyForm
                    closeFunc={() => {
                      setCommentFormID(null);
                    }}
                    postID={postID}
                    commentID={commentID}
                    username={reply.user.username}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Replies;
