import { z } from 'zod'

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
  return success ? Promise.resolve(data) : Promise.reject(error.format())
}