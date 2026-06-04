function formatDateTime(dateTime) {
  if (!dateTime) return "";

  const date = new Date(dateTime);

  return date.toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export { formatDateTime };