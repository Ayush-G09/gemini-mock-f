export function truncateText(text: string, maxLength: number = 20): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export function generateRandomId(length: number = 12): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatToMonthDay(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
