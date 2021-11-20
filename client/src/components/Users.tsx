import no_avatar from "../assets/img/no-user-image.gif";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { Pagination, NotFound } from ".";

import { promiseCopyPaste } from "../utils";

interface IUserProfile {
  user: {
    id: number;
    slug: string;
    user: {
      username: string;
      first_name: string;
      last_name: string;
    };
    avatar?: string;
  };
}

interface IFetchUsers {
  count: number;
  next: string;
  previous: string;
  results: Array<IUserProfile>;
}

const Users = ({ limit = 5, fetchURL = "" }) => {
  const { pageNum } = useParams();

  const [users, setUsers] = useState<IFetchUsers>();

  let currentPage = pageNum ? parseInt(pageNum) : 1;
  let pagesCount = 1;

  useEffect(() => {
    promiseCopyPaste(
      fetch(
        `/api/v1/blog/user_follow/${fetchURL}/?offset=${
          (currentPage - 1) * limit
        }&limit=${limit}`,
        {
          method: "GET",
          headers: new Headers({ "Content-Type": "application/json" }),
        }
      ),
      (result: any) => {
        console.log(result);

        window.scrollTo(0, 0);
        setUsers(result);
      }
    );
  }, [fetchURL, currentPage, limit]);

  if (users) {
    pagesCount = Math.ceil(users?.count / limit);
  }

  if (isNaN(currentPage) || currentPage < 1 || currentPage > pagesCount) {
    return <NotFound />;
  }

  return (
    <>
      <div className="user-menu">
        {users?.results.map((item) => (
          <div key={item.user.id} className="user-menu__user-info">
            <Link to={`/profile/${item.user.slug}`}>
              <img
                className="user-menu__avatar"
                src={null || no_avatar}
                alt="avatar"
              />
            </Link>
            <div className="user-menu__user-info-text">
              <span className="user-menu__fullname">
                {item.user.user.first_name} {item.user.user.last_name}
              </span>
              <Link
                className="user-menu__user-profile-link link"
                to={`/profile/${item.user.slug}`}
              >
                @{item.user.user.username}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        prevPage={currentPage - 1 <= 0 ? null : currentPage - 1}
        nextPage={currentPage + 1 > pagesCount ? null : currentPage + 1}
      />
    </>
  );
};

export default Users;
