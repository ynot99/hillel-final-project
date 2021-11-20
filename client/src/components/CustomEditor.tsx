import "draft-js/dist/Draft.css";

import {
  Editor,
  EditorState,
  ContentBlock,
  Modifier,
  DraftHandleValue,
  getDefaultKeyBinding,
  RichUtils,
} from "draft-js";

const CustomEditor = ({ content, setContent }: any) => {
  const keyBindingFn = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey) {
      setContent(RichUtils.insertSoftNewline(content));
      return "handled";
    }
    return getDefaultKeyBinding(e);
  };

  const handlePastedText = (text: string, html?: string): DraftHandleValue => {
    if (html) {
      const newContent = Modifier.replaceText(
        content.getCurrentContent(),
        content.getSelection(),
        text
      );

      setContent(EditorState.push(content, newContent, "insert-characters"));
      return "handled";
    }
    return "not-handled";
  };

  const blockStyleFn = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();
    if (type === "unstyled") {
      return "block";
    }
    return "";
  };

  return (
    <Editor
      editorState={content}
      onChange={setContent}
      handlePastedText={handlePastedText}
      blockStyleFn={blockStyleFn}
      keyBindingFn={keyBindingFn}
    />
  );
};

export default CustomEditor;
