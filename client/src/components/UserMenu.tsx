import "./UserMenu.scss";
import no_avatar from "../assets/img/no-user-image.gif";
import pencil from "../assets/svg/pencil.svg";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";

import { AuthContext } from "../App";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  return (
    <div className="navigation__user-menu user-menu">
      {authContext.user ? (
        <div className="user-menu__controls">
          <Link to="/post/new">
            <img src={pencil} alt="write a post" title="Write a post" />
          </Link>

          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="user-menu__button"
          >
            <img src={authContext.user.avatar || no_avatar} alt="avatar" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className="user-menu__button"
        >
          <span>Non-authorized user menu</span>
        </button>
      )}
      {isMenuOpen ? (
        <div className="user-menu__menu">
          {authContext.user ? (
            <>
              <div className="user-menu__user-info">
                <Link to={`/profile/${authContext.user.slug}`}>
                  <img
                    className="user-menu__avatar"
                    src={authContext.user.avatar || no_avatar}
                    alt="avatar"
                  />
                </Link>
                <div className="user-menu__user-info-text">
                  <span className="user-menu__fullname">
                    {authContext.user.firstName} {authContext.user.lastName}
                  </span>
                  <Link
                    className="user-menu__user-profile-link link"
                    to={`/profile/${authContext.user.slug}`}
                  >
                    @{authContext.user.username}
                  </Link>
                </div>
              </div>
              <div className="user-menu__links">
                <Link className="user-menu__link" to="/logout">
                  Log out
                </Link>
              </div>
            </>
          ) : (
            <div className="user-menu__unauthorized-links">
              <Link className="user-menu__login btn2" to="/login">
                Login
              </Link>
              <Link className="user-menu__register btn3" to="/register">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UserMenu;
