import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

import { CustomEditor } from "../../components";
import { promiseCopyPaste, getAuthTokenHeaders } from "../../utils";
import IPost from "../../interfaces/Post";

const EditPost = () => {
  const [content, setContent] = useState(() => EditorState.createEmpty());
  const { postNum } = useParams();

  useEffect(() => {
    promiseCopyPaste(
      fetch(`/api/v1/blog/post/${postNum}/edit`, {
        method: "GET",

        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
      }),
      (result: IPost) => {
        setContent(
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(result.content))
          )
        );
      }
    );
  }, []);

  const handleSubmit = () => {
    const raw = convertToRaw(content.getCurrentContent());

    promiseCopyPaste(
      fetch(`/api/v1/blog/post/${postNum}/edit`, {
        method: "PUT",
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
      <button className="btn4" onClick={handleSubmit}>
        Edit
      </button>
    </>
  );
};

export default EditPost;
