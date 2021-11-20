import "./UserInfo.scss";
import no_avatar from "../assets/img/no-user-image.gif";

import moment from "moment";

import { Link } from "react-router-dom";

import Author from "../interfaces/Author";

const UserInfo = ({
  author,
  created_at,
}: {
  author: Author;
  created_at: Date;
}) => {
  return (
    <div className="post__user-info user-info">
      {author ? (
        <Link className="user-info__profile" to={`/profile/${author.slug}`}>
          <img
            className="user-info__avatar"
            src={author.avatar || no_avatar}
            alt="avatar"
          />
          <span className="user-info__username">{author.user.username}</span>
        </Link>
      ) : (
        <span className="user-info__profile">deleted</span>
      )}
      <span className="user-info__date">
        {moment(created_at).format("DD MMMM [at] HH:mm").toString()}
      </span>
    </div>
  );
};

export default UserInfo;
