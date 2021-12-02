import "./UserMenu.scss";
import no_avatar from "../assets/img/no-user-image.gif";
import pencil from "../assets/svg/pencil.svg";

import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { useAppSelector } from "../redux/hooks";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAppSelector((state) => state.userauth.user);

  const ref = useRef<any>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listeners
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={ref} className="navigation__user-menu user-menu">
      {user ? (
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
            <img src={user.avatar || no_avatar} alt="avatar" />
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
          {user ? (
            <>
              <div className="user-menu__user-info">
                <Link to={`/profile/${user.slug}`}>
                  <img
                    className="user-menu__avatar"
                    src={user.avatar || no_avatar}
                    alt="avatar"
                  />
                </Link>
                <div className="user-menu__user-info-text">
                  <span className="user-menu__fullname">
                    {user.firstName} {user.lastName}
                  </span>
                  <Link
                    className="user-menu__user-profile-link link"
                    to={`/profile/${user.slug}`}
                  >
                    @{user.username}
                  </Link>
                </div>
              </div>
              <div className="user-menu__links">
                <Link className="user-menu__link" to="/settings">
                  Settings
                </Link>
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
