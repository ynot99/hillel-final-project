const Votes = ({
  upvotes,
  downvotes,
}: {
  upvotes: number;
  downvotes: number;
}) => {
  const votes = upvotes - downvotes;
  return (
    <div className="article-data__item">
      <span
        className={
          "article-data__number" +
          (votes === 0 ? "" : votes > 0 ? " positive" : " negative")
        }
      >
        rating: <span>{votes}</span>
      </span>
    </div>
  );
};

export default Votes;
