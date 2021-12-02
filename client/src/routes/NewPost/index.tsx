import { useState } from "react";
import { useDispatch } from "react-redux";
import { EditorState, convertToRaw } from "draft-js";
import { useNavigate } from "react-router";

import { promiseCopyPaste, getAuthTokenHeaders } from "../../utils";
import { addPopup } from "../../redux/popup/popupSlice";
import PostEditor from "../../components/PostEditor";

const NewPost = () => {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState(() => EditorState.createEmpty());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    const raw = convertToRaw(content.getCurrentContent());

    promiseCopyPaste(
      fetch("/api/v1/blog/post/create", {
        method: "POST",
        body: JSON.stringify({
          header: heading,
          content: JSON.stringify(raw),
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
      }),
      (result: any) => {
        dispatch(addPopup("Post is successfully created!"));
        navigate("/all");
      }
    );
  };

  return (
    <PostEditor
      btnText="Post"
      heading={heading}
      setHeading={setHeading}
      content={content}
      setContent={setContent}
      handleSubmit={handleSubmit}
    />
  );
};

export default NewPost;
