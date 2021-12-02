import "./Navigation.scss";

import { NavLink } from "react-router-dom";
import { Fragment } from "react";

import UserMenu from "./UserMenu";
import { useAppSelector } from "../redux/hooks";

const Navigation = () => {
  const user = useAppSelector((state) => state.userauth.user);

  const links = [
    {
      to: "/following",
      name: "Following",
      authenticationRequired: true,
    },
    {
      to: "/all",
      name: "All posts",
      authenticationRequired: false,
    },
    {
      to: "/bookmarked",
      name: "Bookmarked",
      authenticationRequired: true,
    },
    {
      to: "/liked",
      name: "Liked",
      authenticationRequired: true,
    },
  ];
  return (
    <nav className="navigation">
      <div className="wrapper">
        <ul className="navigation__list">
          {links.map((item) => {
            if (
              (item.authenticationRequired && user) ||
              !item.authenticationRequired
            ) {
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
            }
            return <Fragment key={item["to"]}></Fragment>;
          })}
        </ul>
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navigation;
