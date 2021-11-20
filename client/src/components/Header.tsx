import "./Header.scss";
import christmasTree from "../assets/img/christmas-tree.png";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="wrapper">
        <img
          style={{ width: 20, height: 20 }}
          src={christmasTree}
          alt="Christmas tree"
        />
        <Link className="header__logo" to="/">
          Blog
        </Link>
        <img
          style={{ width: 20, height: 20 }}
          src={christmasTree}
          alt="Christmas tree"
        />
      </div>
    </header>
  );
};

export default Header;
