export async function get({params}) {
  return {
    status: 200,
    body: JSON.stringify({
      id: 'user-1',
      username: 'twilson63'
    })
  }
}