import "./Pagination.scss";

import { Link } from "react-router-dom";

interface PaginationProps {
  pagesCount: number;
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

const Pagination = ({
  pagesCount,
  currentPage,
  prevPage,
  nextPage,
}: PaginationProps) => {
  return (
    <div className="pagination">
      {prevPage ? (
        <Link className="pagination__link" to={`${prevPage}`}>
          Here
        </Link>
      ) : (
        <span className="pagination__link disabled">Here</span>
      )}
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
                <Link className="pagination__link" to={`${i + 1}`}>
                  {i + 1}
                </Link>
              </li>
            );
          }
        })}
      </ul>
      {nextPage ? (
        <Link className="pagination__link" to={`${nextPage}`}>
          There
        </Link>
      ) : (
        <span className="pagination__link disabled">There</span>
      )}
    </div>
  );
};

export default Pagination;
