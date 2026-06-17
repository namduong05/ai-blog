export function formatDateVN(dateStr) {
  // Convert input string to Date object
  const date = new Date(dateStr);

  // Validate date
  if (isNaN(date)) {
    return "N/A";
  }

  // Define options for formatting
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
    timeZone: "Asia/Ho_Chi_Minh", // Vietnamese time zone
  };

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
}
