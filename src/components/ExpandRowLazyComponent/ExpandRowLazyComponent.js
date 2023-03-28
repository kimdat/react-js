import React, { Suspense, useMemo } from "react";

const ExpandableRowLazyComponent = React.memo(({ row }) => {
  const ExpandRowComponent = useMemo(
    () => React.lazy(() => import("./ExpandRowComponent")),
    []
  );
 
  return (
    <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
      <ExpandRowComponent row={row} />
    </Suspense>
  );
});

export default ExpandableRowLazyComponent;
