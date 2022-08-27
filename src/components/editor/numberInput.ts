// numbers are temporarily invalid if someone is typing things in but i think this
// still handles things ok
export function validateNumber(
  value: number | string | null,
  defaultValue: number
) {
  if (value == null) {
    return defaultValue
  }

  if (typeof value === 'number') {
    return value
  }

  // all of the numbers in here are supposed to be ints, I think
  const parsed = parseInt(value)

  if (!isNaN(parsed)) {
    return parsed
  }

  return defaultValue
}
