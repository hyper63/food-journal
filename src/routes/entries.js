import { connect } from 'hyper-connect'
const hyper = connect(process.env['HYPER'])

export async function get() {
  const entries = await hyper.data.query({type: 'entry'})
  return {
    status: 200,
    body: entries.docs
  }
}