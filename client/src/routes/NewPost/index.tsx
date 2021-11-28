import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";

import { CustomEditor } from "../../components";
import { promiseCopyPaste, getAuthTokenHeaders } from "../../utils";

const NewPost = () => {
  const [content, setContent] = useState(() => EditorState.createEmpty());

  const handleSubmit = () => {
    const raw = convertToRaw(content.getCurrentContent());

    promiseCopyPaste(
      fetch("/api/v1/blog/post/create", {
        method: "POST",
        body: JSON.stringify({
          header: "test header",
          content: JSON.stringify(raw),
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
      }),
      (result: any) => {
        console.log(result);
      }
    );
  };

  return (
    <>
      <CustomEditor content={content} setContent={setContent} />
      <button
        className="btn4"
        onClick={handleSubmit}
        disabled={!content.getCurrentContent().hasText()}
      >
        Post
      </button>
    </>
  );
};

export default NewPost;
