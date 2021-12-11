import { hyper } from '$lib/hyper'

export async function get({ query }) {
  //console.log(query)
  const result = await hyper.data.query({
    type: 'entry',
    date: query.get('date')
  })
  return {
    status: 200,
    body: result
  }

  return {
    status: 200,
    body: {
      ok: true,
      docs: [{
        id: "1",
        type: "entry",
        userId: "twilson63",
        calories: 1000,
        breakfast: 100,
        lunch: 200,
        dinner: 300,
        snacks: 200,
        steps: 10000,
        created: "12/10/2021",
        modified: "12/10/2021",
      }]
    }
  }
}