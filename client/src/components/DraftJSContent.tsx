import draftToHtml from "draftjs-to-html";

const DraftJSContent = ({
  className,
  content,
}: {
  className?: string;
  content: string;
}) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: draftToHtml(JSON.parse(content)),
      }}
    />
  );
};

export default DraftJSContent;
