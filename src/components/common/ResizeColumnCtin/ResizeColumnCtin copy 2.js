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
export const resizeDatatable = () => {
  const resizableColumns = document.querySelectorAll(".rdt_TableCol");
  const rdt_TableRow = document.querySelectorAll(".rdt_TableRow");
  const resizableOtherColumns = [];
  rdt_TableRow.forEach((row) => {
    const cols = row.querySelectorAll(".rdt_TableCell");
    cols.forEach((col, index) => {
      if (!resizableOtherColumns[index]) {
        resizableOtherColumns[index] = []; // Tạo một mảng rỗng nếu chưa tồn tại key tương ứng trong đối tượng obj
      }
      resizableOtherColumns[index].push(col); // Thêm giá trị của cột vào mảng tương ứng
    });
  });
  console.log(resizableOtherColumns);
  reSizeAbleColumn(resizableColumns, resizableOtherColumns);
};
export const reSizeAbleColumn = (nodeHanleResize, nodeOtherResize = "") => {
  //nếu không có nodeclass to resize nào thì mặc định nodetoresize là noderesize

  nodeHanleResize.forEach((column, index) => {
    let startX, startWidth, boundMousemove;
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
      const objBind = { index: index, column: column };
      boundMousemove = mousemove.bind(objBind);
      window.addEventListener("mousemove", boundMousemove);
      window.addEventListener("mouseup", mouseup);
    });

    function mousemove(event) {
      const width = startWidth + event.clientX - startX;
      //resize chính nó
      const columnHandleResize = this.column;
      resize(columnHandleResize, width);
      //resize tại node khác trùng với index của node columnhandleresize
      if (nodeOtherResize !== "") {
        const nodeToResize = nodeOtherResize[this.index];
        console.log(nodeToResize);
        nodeToResize.forEach((colResize) => {
          resize(colResize, width);
        });
      }
    }

    function mouseup(event) {
      window.removeEventListener("mousemove", boundMousemove);
      window.removeEventListener("mouseup", mouseup);
    }
    function resize(column, width) {
      column.style.width = `${width}px`;
      column.style.minWidth = `${width}px`;
      column.style.maxWidth = `${width}px`;
    }
  });
};
