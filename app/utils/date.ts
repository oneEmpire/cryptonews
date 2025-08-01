// lib/utils/date.ts
export function parseSafeDate(input: string | null | undefined): Date {
  if (!input) return new Date()
  return new Date(input.replace(" ", "T") + "Z")
}
