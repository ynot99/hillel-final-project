import "./Pagination.scss";

import { Link } from "react-router-dom";

const Pagination = ({ pagesCount, currentPage, pageLink }) => {
  return (
    <div className="pagination">
      <Link className="pagination__link" to={`/${pageLink}/${1}`}>
        Here
      </Link>
      <ul className="pagination__list">
        {[...Array(pagesCount)].map((undefDontUse, i) => {
          if (i + 1 === currentPage) {
            return (
              <li key={i} className={"pagination__item active"}>
                {i + 1}
              </li>
            );
          } else {
            return (
              <li key={i} className={"pagination__item"}>
                <Link className="pagination__link" to={`/${pageLink}/${i + 1}`}>
                  {i + 1}
                </Link>
              </li>
            );
          }
        })}
      </ul>
      <Link className="pagination__link" to={`/${pageLink}/${3}`}>
        There
      </Link>
    </div>
  );
};

export default Pagination;
