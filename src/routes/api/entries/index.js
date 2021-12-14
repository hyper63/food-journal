import { cast, valid } from '$lib/entry'

export async function get() {
  return {
    status: 200,
    body: []
  }
}

export async function post({ body }) {
  return cast(body)
    .then(valid)
    .then(entry => {
      console.log(entry)
      return {
        status: 200,
        body: {
          ok: true,
          id: entry.id
        }
      }
    })
    .catch(errors => {
      console.log(errors)
      return {
        status: 500,
        body: {
          ok: false,
          errors
        }
      }
    })

}
