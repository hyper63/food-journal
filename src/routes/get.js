import { connect } from 'hyper-connect'
const hyper = connect(process.env['HYPER'])

export async function get ({query}) {
  const entry = await hyper.data.get(`entry-${query.get('entry')}`)
  
  return {
    status: 200,
    body: entry
  }
}