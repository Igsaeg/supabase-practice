type Parts = {
  year: number;
  month: number;
  monthName: string;
  day: number;
  hour: number;
  minute: number;
};

export function parseDate(timestamp: string): Parts {
  const iso = timestamp
    .replace(" ", "T")
    .replace(/([+-]\d{2})$/, "$1:00");

  const date = new Date(iso);
  if (isNaN(date.getTime())) throw new Error(`Invalid timestamp: ${timestamp}`);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    monthName,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}