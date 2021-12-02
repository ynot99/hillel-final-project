import "./FeedFilter.scss";

import { useState } from "react";

const FeedFilter = ({ heading }: { heading: string }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <div className="feed-filter block">
      <button
        className="unstyled-btn"
        onClick={() => {
          setIsFilterVisible(!isFilterVisible);
        }}
      >
        <h1 className="feed-filter__heading">{heading}</h1>
      </button>
      {isFilterVisible && <p>Filter</p>}
    </div>
  );
};

export default FeedFilter;
