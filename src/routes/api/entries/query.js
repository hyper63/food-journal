import { newEntry } from '$lib/entry'

export async function get({ query }) {
  return {
    status: 200,
    body: {
      ok: true,
      docs: [newEntry()]
    }
  }
}