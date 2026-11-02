const WARSAW = "Europe/Warsaw";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: WARSAW,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function warsawParts(date) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [
      type,
      value,
    ])
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: parts.weekday,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function mondayAt20(date, daysUntilMonday) {
  const p = warsawParts(date);

  const targetDay = new Date(
    Date.UTC(p.year, p.month - 1, p.day + daysUntilMonday)
  );

  const year = targetDay.getUTCFullYear();
  const month = targetDay.getUTCMonth() + 1;
  const day = targetDay.getUTCDate();

  // Wyszukujemy 20:00 w polskiej strefie czasowej.
  // Pozwala to uwzględnić zmianę czasu letniego i zimowego.
  const start = Date.UTC(year, month - 1, day, 17);

  for (let i = 0; i <= 5 * 60; i++) {
    const candidate = new Date(start + i * 60_000);
    const local = warsawParts(candidate);

    if (
      local.year === year &&
      local.month === month &&
      local.day === day &&
      local.hour === 20 &&
      local.minute === 0
    ) {
      return candidate;
    }
  }

  throw new Error("Nie udało się obliczyć terminu usunięcia.");
}

export function calculateInsuranceExpiry(receivedAt = new Date()) {
  const date = new Date(receivedAt);

  if (!Number.isFinite(date.getTime())) {
    throw new Error("Nieprawidłowa data zgłoszenia.");
  }

  const weekday = warsawParts(date).weekday;

  const daysUntilMonday = {
    Fri: 3,
    Sat: 2,
    Sun: 1,
  }[weekday];

  if (daysUntilMonday === undefined) {
    return new Date(date.getTime() + 24 * 60 * 60 * 1000)
      .toISOString();
  }

  return mondayAt20(date, daysUntilMonday).toISOString();
}
