import { cast, valid } from '$lib/entry'

const USER = process.env['USER']

export async function get({ params }) {
  return {
    status: 404
  }
}

export async function put({ params, body }) {
  return cast(body)
    .then(valid)
    .then(_ => ({ status: 200, body: { ok: true } }))
    .catch(errors => ({ status: 500, body: { ok: false, errors } }))
}

export async function del({ params }) {
  return {
    status: 200,
    body: 'OK'
  }
}
