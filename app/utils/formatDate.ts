import { format, addDays } from "date-fns";

export default function formatDate(date: string, addDay = false): string {
  const parsedDate = new Date(date);
  const nextDay = addDays(parsedDate, 1);
  return format(addDay ? nextDay : parsedDate, "MMMM d, yyyy");
}
