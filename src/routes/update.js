import { connect } from 'hyper-connect'

const hyper = connect(process.env['HYPER'])

export async function put({ body }) {
  const result = await hyper.data.update(body.id, body)
  return {
    body: result,
    status: 200
  }
}