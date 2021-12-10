import { z } from 'zod'

const User = z.object({
  id: z.string(),
  username: z.string()
})

export function valid(data) {
  const { success, data, error } = User.safeParse(data)
  return success ? Promise.resolve(data) : Promise.reject(error.format())
}