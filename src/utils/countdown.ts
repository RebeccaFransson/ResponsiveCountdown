/**
 * Takes a date as a parameter and converts it to a string
 * that shows how many days, hours, minutes and seconds
 * there is left until the given date.
 *
 * @param date eg. 2025-05-05
 * @returns string eg. "185 days, 14h, 58m, 25s"
 */
export const calculateTimeUntil = (date: Date) => {
  const total = date.getTime() - new Date().getTime()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  let string = ''
  if (seconds) string = `${days | hours | minutes ? ',' : ''} ${seconds}s`
  if (minutes) string = `${days | hours ? ',' : ''} ${minutes}m${string}`
  if (hours) string = `${days ? ',' : ''} ${hours}h${string}`
  if (days) string = `${days} ${days === 1 ? 'day' : 'days'}${string}`
  return string
}
