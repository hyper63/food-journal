import { valid } from '$lib/entry'

export async function get({ params }) {
  return {
    status: 200,
    body: JSON.stringify([])
  }
}

export async function put({ params, body }) {
  return valid(body)
    .then(entry => ({ status: 200, body: { ok: true } }))
    .catch(errors => ({ status: 500, body: { ok: false, errors } }))
}

export async function del({ params }) {
  return {
    status: 200,
    body: 'OK'
  }
}
