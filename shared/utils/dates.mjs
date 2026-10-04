export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function monday(date = new Date()) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dateKey(d);
}
export function shiftDate(key, days) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export function isDateKey(key) {
  return (
    typeof key === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(key) &&
    dateKey(new Date(`${key}T12:00:00`)) === key
  );
}
