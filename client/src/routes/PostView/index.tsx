import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Post } from "../../components";

const PostView = () => {
  const pageParams = useParams();
  const [post, setPost] = useState();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set(
      "Authorization",
      `${authToken === null ? undefined : `Token ${authToken}`}`
    );

    fetch(`/api/v1/blog/post/${pageParams["postNum"]}`, {
      method: "GET",
      headers: requestHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response.text());
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        console.log(result);
        setPost(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [pageParams]);
  return <Post postData={post} />;
};

export default PostView;
