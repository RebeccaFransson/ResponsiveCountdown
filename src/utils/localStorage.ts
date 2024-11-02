const COUNTDOWN_DATA_KEY = 'COUNTDOWN_DATA'
type CountdownData = { title: string; date: string }

export const CountdownStorage = {
  get: () => {
    const json = localStorage.getItem(COUNTDOWN_DATA_KEY)
    const isCountdownData = (data: any): data is CountdownData => {
      return data.hasOwnProperty('date') && data.hasOwnProperty('title')
    }
    if (json) {
      const obj = JSON.parse(json)
      if (isCountdownData(obj)) return obj
      else
        throw new Error(
          "Data saved in local storage is not the correct type. Expected type is 'CountdownData'.",
        )
    }
    return null
  },
  setTitle: (title: string) => {
    const data = CountdownStorage.get() ?? { title: '', date: '' }
    localStorage.setItem(COUNTDOWN_DATA_KEY, JSON.stringify({ ...data, title }))
  },
  setDate: (date: string) => {
    const data = CountdownStorage.get() ?? { title: '', date: '' }
    localStorage.setItem(COUNTDOWN_DATA_KEY, JSON.stringify({ ...data, date }))
  },
}
