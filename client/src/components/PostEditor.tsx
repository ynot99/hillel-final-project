import "./PostEditor.scss";

import { EditorState } from "draft-js";
import { Dispatch, MouseEventHandler } from "react";
import { CustomEditor } from ".";

const PostEditor = ({
  btnText,
  heading,
  setHeading,
  content,
  setContent,
  handleSubmit,
}: {
  btnText: string;
  heading: string;
  setHeading: Dispatch<string>;
  content: EditorState;
  setContent: Dispatch<EditorState>;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="post-editor">
      <input
        className="post-editor__title block"
        autoComplete="off"
        name="heading"
        type="text"
        value={heading}
        onChange={(e: any) => {
          setHeading(e.target.value);
        }}
        placeholder="Title"
      />
      <CustomEditor content={content} setContent={setContent} />
      <button
        className="post-editor__btn btn4"
        onClick={handleSubmit}
        disabled={!content.getCurrentContent().hasText() || !heading}
      >
        {btnText}
      </button>
    </div>
  );
};

export default PostEditor;
