import { useReducer } from "react";

import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";

interface BookmarkProps {
  id: number;
  isActive: boolean;
  count: number;
}

const Bookmark = ({ id, isActive, count }: BookmarkProps) => {
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
    if (bookmarkState["isLoading"]) {
      return;
    }

    bookmarkDispatch({ type: "loading" });

    let url = "create";
    if (bookmarkState["isActive"]) {
      url = "delete";
    }

    promiseCopyPaste(
      fetch(`/api/v1/blog/post/bookmark/${url}`, {
        method: url === "create" ? "POST" : "DELETE",
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
