import { Posts, FeedFilter } from "./";

const Feed = ({
  heading,
  fetchURL = "",
}: {
  heading: string;
  fetchURL?: string;
}) => {
  return (
    <>
      <FeedFilter heading={heading} />
      <Posts fetchURL={fetchURL} />
    </>
  );
};

export default Feed;
