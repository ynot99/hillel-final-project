import { Link } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="wrapper">
        <Link className="header__logo" to="/">
          Blog
        </Link>
      </div>
    </header>
  );
};

export default Header;
