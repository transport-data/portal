export function prettifyDateString(date: string) {
  if (date.length > 10) {
    return new Date(date);
  }
  const [year, month, day] = date.split("-").map(Number);
  const dateObject = new Date(year as number, (month as number) - 1, day);
  return dateObject.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
