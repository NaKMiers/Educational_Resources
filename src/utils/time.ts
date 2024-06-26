import moment from 'moment'

export const formatTime = (time: string): string => {
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}

export const formatDate = (time: string): string => {
  // format time using "moment" library consist of day, month, year
  return time && moment(time).format('DD/MM/YYYY')
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isToday = (date: Date): boolean => {
  return isSameDate(date, new Date())
}

export const duration = (seconds: number, type: 'short' | 'long' = 'short') => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  if (type === 'short') {
    // format: hh:mm
    const hh = `${h < 10 ? '0' : ''}${h}h`
    const mm = `${m < 10 ? '0' : ''}${m}m`
    return `${h > 0 ? hh : ''}${h > 0 && m > 9 ? ':' : ''}${m > 0 ? mm : ''}`
  } else if (type === 'long') {
    // format: 1 hour 2 minutes
    return `${h > 0 ? `${h} hour${h > 1 ? 's' : ''}` : ''} ${
      m > 0 ? `${m} minute${m > 1 ? 's' : ''}` : ''
    }`
  }
}

// return time remaining: 1d:2h:3m
export const getTimeRemaining = (
  expireDate: Date | string,
  isReturnObject: boolean = false
): string | { day: number; hour: number; minute: number } => {
  const now = moment()
  const expirationDate = moment(expireDate)

  const diff = moment.duration(expirationDate.diff(now))

  const days = diff.days()
  const hours = diff.hours()
  const minutes = diff.minutes()

  let timeRemaining = ''

  if (days > 0) {
    timeRemaining += `${days}d:`
  }

  if (hours > 0) {
    timeRemaining += `${hours}h:`
  }

  if (minutes > 0) {
    timeRemaining += `${minutes}m`
  }

  // Remove trailing comma and space if they exist
  if (timeRemaining.endsWith(', ')) {
    timeRemaining = timeRemaining.slice(0, -2)
  }

  return isReturnObject
    ? {
        day: +days,
        hour: +hours,
        minute: +minutes,
      }
    : timeRemaining
}

// return percent of using time
export const usingPercentage = (begin: Date | string, expire: Date | string): number => {
  const now = moment()
  const beginDate = moment(begin)
  const expirationDate = moment(expire)

  const total = expirationDate.diff(beginDate)
  const remaining = expirationDate.diff(now)

  return Math.round((1 - remaining / total) * 100)
}

export const getColorClass = (begin: Date | string, expire: Date | string) => {
  const percentage = usingPercentage(begin, expire)
  if (percentage >= 93) {
    return 'text-red-500'
  } else if (percentage >= 80) {
    return 'text-yellow-500'
  } else {
    return 'text-green-500'
  }
}

// get times
export const getTimes = (d = 0, h = 0, m = 0, s = 0) => {
  // convert all to seconds
  const totalSeconds = h * 3600 + m * 60 + s

  // calc days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / (24 * 3600))
  const remainingSeconds = totalSeconds % (24 * 3600)
  const hours = Math.floor(remainingSeconds / 3600)
  const remainingSecondsAfterHours = remainingSeconds % 3600
  const minutes = Math.floor(remainingSecondsAfterHours / 60)
  const seconds = remainingSecondsAfterHours % 60

  return {
    days: days + d,
    hours,
    minutes,
    seconds,
  }
}

// from numbers of (day, hour, minute, second) => expire time
export const calcExpireTime = (d = 0, h = 0, m = 0, s = 0) => {
  // calc days, hours, minutes, seconds
  const { days, hours, minutes, seconds } = getTimes(d, h, m, s)

  // get current time
  const currentTime = new Date()

  // add time to current time
  const expireTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate() + days,
    currentTime.getHours() + hours,
    currentTime.getMinutes() + minutes,
    currentTime.getSeconds() + seconds
  )

  return expireTime
}
