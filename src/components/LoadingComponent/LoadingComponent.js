import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./LoadingComponent.css";

const LoadingComponent = React.memo(({ isLoading, children }) => {
  return (
    <div>
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default LoadingComponent;
