import { format, startOfWeek, endOfWeek } from 'date-fns'

export function startOfWeek(date) {
  return format(startOfWeek(date), 'yyyy-MM-dd')
}

export function endOfWeek(date) {
 return format(endOfWeek(date), 'yyyy-MM-dd')
}