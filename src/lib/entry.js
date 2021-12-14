import { z } from 'zod'
import { format } from 'date-fns'
import cuid from 'cuid'

const USER = 'twilson63'

const Entry = z.object({
  id: z.string(),
  type: z.literal('entry').default('entry'),
  userId: z.string(),
  date: z.string(),
  calories: z.number().nonnegative(),
  steps: z.number().nonnegative(),
  breakfast: z.number().nonnegative(),
  lunch: z.number().nonnegative(),
  dinner: z.number().nonnegative(),
  snacks: z.number().nonnegative(),
  created: z.string(),
  modified: z.string()

})

export function valid(entry) {
  const { success, data, error } = Entry.safeParse(entry)
  return success ? Promise.resolve(data) : Promise.reject(error.flatten())
}

export function newEntry() {
  return {
    id: 'new',
    type: "entry",
    date: format(new Date(), 'yyyy-MM-dd'),
    userId: USER,
    calories: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
    steps: 0,
    created: format(new Date(), 'MM/dd/yyyy'),
    modified: format(new Date(), 'MM/dd/yyyy'),
  }
}

const of = Promise.resolve.bind(Promise)
const assoc = (key, value, obj) => {
  obj[key] = value;
  return obj;
}

const totalCalories = entry => assoc('calories', entry.breakfast + entry.lunch + entry.dinner + entry.snacks, entry)
//const tap = f => v => (f(v), v)
const setUser = entry => assoc('userId', USER, entry)
const setCreated = entry => !entry.created ? assoc('created', format(new Date(), 'MM/dd/yyyy'), entry) : entry
const setModified = entry => assoc('modified', format(new Date(), 'MM/dd/yyyy'), entry)
const generateId = entry => entry.id === 'new' ? assoc('id', `entry-${cuid()}`, entry) : entry

export const cast = entry => of(entry)
  .then(generateId)
  .then(totalCalories)
  .then(setUser)
  .then(setCreated)
  .then(setModified)
