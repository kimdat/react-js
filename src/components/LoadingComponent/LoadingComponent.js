import React from "react";

import "./LoadingComponent.css";

const LoadingComponent = React.memo(({ isLoading, children }) => {
  return (
    <div>
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default LoadingComponent;
