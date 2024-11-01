export const isValidDate = (dateString: string) => {
  // Check format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  const date = new Date(dateString)
  return !isNaN(date.getTime()) && dateString === date.toISOString().slice(0, 10)
}
