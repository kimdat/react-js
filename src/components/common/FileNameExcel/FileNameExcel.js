export const getInventoryDateString = () => {
  const currentDate = new Date()
    .toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, "");

  const currentTime = new Date()
    .toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/:/g, "");

  return `inventory-${currentDate}-${currentTime}.xlsx`;
};
