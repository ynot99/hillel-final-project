import { Posts, FeedFilter } from "./";

const Feed = ({ fetchURL = "" }) => {
  return (
    <>
      <FeedFilter />
      <Posts fetchURL={fetchURL} />
    </>
  );
};

export default Feed;
