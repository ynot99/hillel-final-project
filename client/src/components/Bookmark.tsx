import { useReducer } from "react";

import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";
import { unauthorized } from "../redux/popup/popupSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface BookmarkProps {
  id: number;
  isActive: boolean;
  count: number;
}

const Bookmark = ({ id, isActive, count }: BookmarkProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userauth.user);

  // TODO make this redux?
  const bookmarkReducer = (
    state: { isActive: boolean; isLoading: boolean; number: number },
    action: { type: string }
  ) => {
    switch (action.type) {
      case "toggleIsActive":
        return {
          ...state,
          isLoading: false,
          isActive: !state["isActive"],
        };
      case "loading":
        return {
          ...state,
          isLoading: true,
        };
      case "error":
        return {
          ...state,
          isLoading: false,
        };
      case "increment":
        return {
          ...state,
          number: state["number"] + 1,
        };
      case "decrement":
        return {
          ...state,
          number: state["number"] - 1,
        };
      default:
        throw new Error("Called wrong dispatch event");
    }
  };

  const [bookmarkState, bookmarkDispatch] = useReducer(bookmarkReducer, {
    isLoading: false,
    isActive: isActive,
    number: count,
  });

  const handleAddBookmark = () => {
    if (!user) {
      dispatch(unauthorized());
      return;
    }
    if (bookmarkState["isLoading"]) {
      return;
    }

    bookmarkDispatch({ type: "loading" });

    let method = "POST";
    if (bookmarkState["isActive"]) {
      method = "DELETE";
    }

    promiseCopyPaste(
      fetch(`/api/v1/blog/bookmark/`, {
        method: method,
        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
        body: JSON.stringify({ post: id }),
      }),
      (result: any) => {
        if (bookmarkState["isActive"]) {
          bookmarkDispatch({ type: "decrement" });
        } else {
          bookmarkDispatch({ type: "increment" });
        }
        bookmarkDispatch({ type: "toggleIsActive" });
      },
      (err: Error) => {
        bookmarkDispatch({ type: "error" });
      }
    );
  };

  return (
    <button
      onClick={() => {
        handleAddBookmark();
      }}
      className={`article-data__item button${
        bookmarkState["isLoading"] ? " loading" : ""
      }${bookmarkState["isActive"] ? " active" : ""}`}
    >
      <span className="article-data__number">
        bookmarks: <span>{bookmarkState["number"]}</span>
      </span>
    </button>
  );
};

export default Bookmark;
