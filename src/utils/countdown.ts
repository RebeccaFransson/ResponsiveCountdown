/**
 * Takes a date as a parameter and converts it to a string
 * that shows how many days, hours, minutes and seconds
 * there is left until the given date.
 *
 * @param date eg. 2025-01-01
 * @returns string eg. "58 days, 3 h, 15m, 10s"
 */
export const calculateTimeUntil = (date: Date) => {
  const total = date.getTime() - new Date().getTime()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  let string = ''
  if (seconds)
    string = `${days | hours | minutes ? ',' : ''} ${seconds} ${seconds === 1 ? 'sec' : 'secs'}`
  if (minutes)
    string = `${days | hours ? ',' : ''} ${minutes} ${minutes === 1 ? 'min' : 'mins'}${string}`
  if (hours) string = `${days ? ',' : ''} ${hours} ${hours === 1 ? 'hr' : 'hrs'}${string}`
  if (days) string = `${days} ${days === 1 ? 'day' : 'days'}${string}`
  return string
}
