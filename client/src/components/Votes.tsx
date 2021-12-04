import { ReactComponent as ThumbUp } from "../assets/svg/thumb-up.svg";
import { ReactComponent as ThumbDown } from "../assets/svg/thumb-down.svg";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import { unauthorized } from "../redux/popup/popupSlice";
import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";

const Votes = ({
  rating,
  postURL,
  body,
  isUpvoted = null,
  isRatingBtnsVisible = false,
}: {
  rating: number;
  postURL: string;
  body: object;
  isUpvoted: boolean | null;
  isRatingBtnsVisible?: boolean;
}) => {
  const [isUpvote, setIsUpvote] = useState<boolean | null>(isUpvoted);
  const [ratingState, setRatingState] = useState(rating);
  const user = useAppSelector((state) => state.userauth.user);
  const dispatch = useDispatch();

  const handleVote = (buttonIsUpvote: boolean) => {
    if (!user) {
      dispatch(unauthorized());
      return;
    }

    let method = "POST";
    if (isUpvote === buttonIsUpvote) {
      method = "DELETE";
    } else if (isUpvote !== null) {
      method = "PUT";
    }

    promiseCopyPaste(
      fetch(`/api/v1/blog/${postURL}`, {
        method: method,
        headers: new Headers({
          ...getAuthTokenHeaders(),
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          is_upvote: buttonIsUpvote,
          ...body,
        }),
      }),
      (result: any) => {
        switch (method) {
          case "POST":
            setIsUpvote(buttonIsUpvote);
            setRatingState(ratingState + (buttonIsUpvote ? 1 : -1));
            break;
          case "DELETE":
            setIsUpvote(null);
            setRatingState(ratingState - (buttonIsUpvote ? 1 : -1));
            break;
          case "PUT":
            setIsUpvote(buttonIsUpvote);
            setRatingState(ratingState + (buttonIsUpvote ? 2 : -2));
            break;
        }
      }
    );
  };

  return (
    <div className="article-data__item">
      <span
        className={
          "article-data__number" +
          (ratingState === 0 ? "" : ratingState > 0 ? " positive" : " negative")
        }
      >
        {isRatingBtnsVisible && (
          <>
            <button
              className={`article-data__thumb-up ${
                isUpvote ? "active" : ""
              } unstyled-btn`}
              onClick={() => {
                handleVote(true);
              }}
            >
              <ThumbUp />
            </button>
            <button
              className={`article-data__thumb-down ${
                isUpvote === false ? "active" : ""
              } unstyled-btn`}
              onClick={() => {
                handleVote(false);
              }}
            >
              <ThumbDown />
            </button>
          </>
        )}
        rating: <span>{ratingState}</span>
      </span>
    </div>
  );
};

export default Votes;
