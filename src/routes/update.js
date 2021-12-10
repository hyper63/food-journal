import { connect } from 'hyper-connect'

const hyper = connect(process.env['HYPER'])

export async function put({ body }) {
  const result = await hyper.data.update(body.id, {
    type: 'entry',
    calories: sum([body.breakfast, body.lunch, body.dinner, body.snacks]),
    ...body
  })

  return {
    body: result,
    status: 200
  }
}

function add(a, b) {
  return a + b
}

function sum(cals) {
  return cals.reduce(add, 0)
}