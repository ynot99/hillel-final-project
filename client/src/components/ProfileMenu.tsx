import "./ProfileMenu.scss";

import { NavLink } from "react-router-dom";
import { Fragment } from "react";

const ProfileMenu = ({
  postCount,
  commentCount,
  bookmarkCount,
  likesCount,
  followersCount,
  followCount,
}: {
  postCount: number;
  commentCount: number;
  bookmarkCount: number;
  likesCount: number;
  followersCount: number;
  followCount: number;
}) => {
  console.log(likesCount);

  const profileTabs = [
    { to: "posts", name: "Posts", count: postCount },
    { to: "comments", name: "Comments", count: commentCount },
    { to: "bookmarks", name: "Bookmarks", count: bookmarkCount },
    { to: "likes", name: "Likes", count: likesCount },
    // FIXME Bad Logic
    { to: "followers", name: "Followers", count: followCount },
    { to: "following", name: "Following", count: followersCount },
  ];

  return (
    <div className="profile-menu">
      <ul className="profile-menu__tab-list">
        {profileTabs.map((item) => {
          if (item.count > 0) {
            return (
              <li key={item.to} className="profile-menu__tab-item">
                <NavLink
                  className={(isActive) =>
                    `profile-menu__tab-link${
                      isActive.isActive ? " active" : ""
                    }`
                  }
                  to={item.to}
                >
                  {item.name}
                  <span className="profile-menu__count">{item.count}</span>
                </NavLink>
              </li>
            );
          }
          return <Fragment key={item.to} />;
        })}
      </ul>
    </div>
  );
};

export default ProfileMenu;
