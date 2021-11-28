import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuthTokenHeaders, promiseCopyPaste } from "../../utils";

const DeletePost = () => {
  const { postNum } = useParams();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    promiseCopyPaste(
      fetch(`/api/v1/blog/post/auth/${postNum}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        },
      }),
      (result: any) => {
        setMessage("Post successfully deleted");
      },
      (err: any) => {
        setMessage("Post not deleted!");
      }
    );
  }, [postNum]);

  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default DeletePost;
