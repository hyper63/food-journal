<script>
  import { onMount } from 'svelte'
  import { format } from 'date-fns'

  let entry = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0
  }
  
  const entryId = format(new Date(), 'yyyyMMdd')

  onMount(async () => {
    const result = await fetch(`/get?entry=${entryId}`)
    if (result.ok) {
      entry = await result.json()
    }
  })

  function sum(nums) {
    const add = (a,b) => a + b
    return nums.reduce(add, 0)
  }

  $: total = sum([
    entry.breakfast, 
    entry.lunch, 
    entry.dinner, 
    entry.snacks
  ])
  
</script>
<header>
  <nav style="float: right;">
    <a href='/edit'>Edit</a>
  </nav>
  <h1>Food Journal</h1>

</header>
<main>
  <section>
    <div>Calories for</div>
    <div>12/10/2021</div>
    <div class="big">{total}</div>
    <div>
      <table>
        <tr>
          <th>Breakfast</th>
          <td>{entry.breakfast}</td>
        </tr>
        <tr>
          <th>Lunch</th>
          <td>{entry.lunch}</td>
        </tr>
        <tr>
          <th>Dinner</th>
          <td>{entry.dinner}</td>
        </tr>
        <tr>
          <th>Snacks</th>
          <td>{entry.snacks}</td>
        </tr>

      </table>
    </div>
    <div class="top-5">Steps</div>
    <div class="big">5970</div>
  </section>
</main>
<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .big {
    font-size: 4em;
  }
  .top-5 {
    margin-top: 40px;
  }
</style>