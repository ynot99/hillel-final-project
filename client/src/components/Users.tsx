import no_avatar from "../assets/img/no-user-image.gif";

import { useState } from "react";
import { Link } from "react-router-dom";

import PaginationPage from "./PaginationPage";

interface ResponseUser {
  user: {
    id: number;
    slug: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

const Users = ({ fetchURL = "" }) => {
  const [users, setUsers] = useState<PaginationResponse<ResponseUser>>();

  return (
    <PaginationPage
      fetchURL={`/api/v1/blog/user_follow/${fetchURL}`}
      responseData={users}
      setResponseData={setUsers}
    >
      <div className="user-menu">
        {users?.results.map((uitem) => {
          const item = uitem.user;

          return (
            <div key={item.id} className="user-menu__user-info">
              <Link to={`/profile/${item.slug}`}>
                <img
                  className="user-menu__avatar"
                  src={null || no_avatar}
                  alt="avatar"
                />
              </Link>
              <div className="user-menu__user-info-text">
                <span className="user-menu__fullname">
                  {item.first_name} {item.last_name}
                </span>
                <Link
                  className="user-menu__user-profile-link link"
                  to={`/profile/${item.slug}`}
                >
                  @{item.username}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </PaginationPage>
  );
};

export default Users;
