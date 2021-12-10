import { valid } from '$lib/entry'

export async function get() {
  return {
    status: 200,
    body: JSON.stringify([])
  }
}

export async function post({ body }) {
  return valid(body)
    .then(entry => {
      console.log(entry)
      return {
        status: 200,
        body: {
          ok: true,
          id: 'entry-user-1'
        }
      }
    })
    .catch(errors => {
      return {
        status: 500,
        body: {
          ok: false,
          errors
        }
      }
    })

}
