import "./Navigation.scss";

import { Link, NavLink } from "react-router-dom";
import { useState, useContext } from "react";

import { AuthContext } from "../App";

interface NavigationProps {
  Avatar?: HTMLImageElement;
}

const Navigation = ({ Avatar }: NavigationProps) => {
  const authContext = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    {
      to: "/feed",
      name: "My feed",
    },
    {
      to: "/all",
      name: "All posts",
    },
  ];
  return (
    <nav className="navigation">
      <div className="wrapper">
        <ul className="navigation__list">
          {links.map((item) => {
            return (
              <li key={item["to"]} className="navigation__item">
                <NavLink
                  className={(isActive) =>
                    "navigation__link" + (isActive.isActive ? " active" : "")
                  }
                  to={item["to"]}
                >
                  {item["name"]}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="navigation__user-menu user-menu">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="user-menu__button"
          >
            user menu
          </button>
          {isMenuOpen ? (
            <div className="user-menu__menu block">
              {authContext ? (
                <Link className="user-menu__login btn2" to="/logout">
                  Log out
                </Link>
              ) : (
                <>
                  <Link className="user-menu__login btn2" to="/login">
                    Login
                  </Link>
                  <Link className="user-menu__register btn3" to="/register">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
