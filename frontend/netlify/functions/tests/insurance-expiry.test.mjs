import assert from "node:assert/strict";
import { calculateInsuranceExpiry } from "./insurance-expiry.mjs";

const cases = [
  {
    name: "Poniedziałek — 24 godziny",
    received: "2026-11-02T09:00:00Z",
    expected: "2026-11-03T09:00:00.000Z",
  },
  {
    name: "Czwartek — 24 godziny",
    received: "2026-11-05T09:00:00Z",
    expected: "2026-11-06T09:00:00.000Z",
  },
  {
    name: "Piątek — do poniedziałku 20:00",
    received: "2026-11-06T09:00:00Z",
    expected: "2026-11-09T19:00:00.000Z",
  },
  {
    name: "Sobota — do poniedziałku 20:00",
    received: "2026-11-07T09:00:00Z",
    expected: "2026-11-09T19:00:00.000Z",
  },
  {
    name: "Niedziela — do poniedziałku 20:00",
    received: "2026-11-08T09:00:00Z",
    expected: "2026-11-09T19:00:00.000Z",
  },
  {
    name: "Zmiana na czas letni",
    received: "2026-03-27T09:00:00Z",
    expected: "2026-03-30T18:00:00.000Z",
  },
  {
    name: "Zmiana na czas zimowy",
    received: "2026-10-23T09:00:00Z",
    expected: "2026-10-26T19:00:00.000Z",
  },
];

for (const test of cases) {
  const actual = calculateInsuranceExpiry(test.received);

  assert.equal(
    actual,
    test.expected,
    `Nieprawidłowy termin: ${test.name}`
  );

  console.log(`OK — ${test.name}`);
}

console.log("TEST OK — wszystkie terminy usuwania są poprawne.");
