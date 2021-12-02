import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { promiseCopyPaste, getAuthTokenHeaders } from "../../utils";
import IPost from "../../interfaces/Post";
import { addPopup } from "../../redux/popup/popupSlice";
import PostEditor from "../../components/PostEditor";

const EditPost = () => {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState(() => EditorState.createEmpty());
  const { postNum } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    promiseCopyPaste(
      fetch(`/api/v1/blog/post/auth/${postNum}`, {
        method: "GET",

        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
      }),
      (result: IPost) => {
        setHeading(result.header);
        setContent(
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(result.content))
          )
        );
      }
    );
  }, [postNum]);

  const handleSubmit = () => {
    const raw = convertToRaw(content.getCurrentContent());

    promiseCopyPaste(
      fetch(`/api/v1/blog/post/auth/${postNum}`, {
        method: "PUT",
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
        dispatch(addPopup("Post is successfully edited!"));
        navigate("/all");
      }
    );
  };

  return (
    <PostEditor
      btnText="Edit"
      heading={heading}
      setHeading={setHeading}
      content={content}
      setContent={setContent}
      handleSubmit={handleSubmit}
    />
  );
};

export default EditPost;
