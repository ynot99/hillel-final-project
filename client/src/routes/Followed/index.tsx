import { Feed } from "../../components";

const Followed = () => {
  return <Feed heading="Following" fetchURL="user_follow" />;
};

export default Followed;
