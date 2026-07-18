export function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const date = new Date(startDate);
  const dates: Date[] = [];
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}
