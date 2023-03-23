export const mouseDownRezie = (e, classNamesResize) => {
  e.preventDefault();
  console.log(e.target.style.borderRight);
  let prevX = e.clientX;
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);

  function handleResize(e) {
    const width = prevX - e.clientX;
    prevX = e.clientX;
    if (width !== 0) {
      const el = document.querySelector(classNamesResize);
      const rect = el.getBoundingClientRect();
      el.style.width = rect.width - width + "px";
    }
  }

  function stopResize() {
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  }
};
export const reSizeAbleColumn = (nodeHanleResize, nodeToResize = "") => {
  nodeHanleResize.forEach((column, index) => {
    let startX, startWidth;
    column.addEventListener("mousedown", function (event) {
      const rect = column.getBoundingClientRect();
      const threshold = 18; // distance from top-right corner to trigger mouseout
      const isOnRightEdge = event.clientX >= rect.right - threshold;
      const isOnBottomEdge = event.clientY >= rect.bottom - threshold;
      if (!isOnRightEdge || !isOnBottomEdge) {
        return;
      }
      startX = event.clientX;
      startWidth = parseInt(window.getComputedStyle(column).width);

      window.addEventListener("mousemove", mousemove.bind(column));
      window.addEventListener(
        "mouseup",
        function () {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", this);
        }.bind(mouseup)
      );
    });

    function mousemove(event) {
      console.log("123");
      const width = startWidth + event.clientX - startX;

      /*column.style.width = `${width}px`;
      column.style.minWidth = `${width}px`;
      column.style.maxWidth = `${width}px`;*/
    }

    function mouseup(event) {
      // empty function body
    }
  });
};
