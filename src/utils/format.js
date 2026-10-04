export const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function formatDate(
  value,
  options = { month: "short", day: "numeric" },
) {
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? value + "T12:00:00"
      : value;
  return new Date(date).toLocaleDateString("en-US", options);
}
export function formatWeight(weight) {
  return weight === null || weight === 0 ? "BW" : weight + " kg";
}
