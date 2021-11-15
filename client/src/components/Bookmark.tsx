import { useReducer } from "react";

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

    let url = "/api/v1/blog/post/bookmark/";
    let method = "POST";
    if (bookmarkState["isActive"]) {
      url += "delete";
      method = "DELETE";
    } else {
      url += "create";
    }
    const authToken = localStorage.getItem("auth-token");
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set(
      "Authorization",
      `${authToken === null ? undefined : `Token ${authToken}`}`
    );

    fetch(url, {
      method: method,
      headers: requestHeaders,
      body: JSON.stringify({ post: id }),
    })
      .then((response) => {
        if (response.ok) {
          if (method === "POST") {
            return response.json();
          } else {
            return {};
          }
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        if (bookmarkState["isActive"]) {
          bookmarkDispatch({ type: "decrement" });
        } else {
          bookmarkDispatch({ type: "increment" });
        }
        bookmarkDispatch({ type: "toggleIsActive" });
      })
      .catch((err) => {
        bookmarkDispatch({ type: "error" });
        console.error(err);
      });
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
