<script context="module">
  import { format } from "date-fns";
  const entryId = format(new Date(), "yyyyMMdd");

  export async function load({ fetch }) {
    const result = await fetch(`/get?entry=${entryId}`);

    if (result.ok) {
      return {
        props: {
          entry: await result.json(),
        },
      };
    }
    return {
      status: result.status,
    };
  }
</script>

<script>
  export let entry = {
    type: 'entry',
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
    steps: 0
  };

  function sum(nums) {
    const add = (a, b) => a + b;
    return nums.reduce(add, 0);
  }

  $: total = sum([entry.breakfast, entry.lunch, entry.dinner, entry.snacks]);
</script>

<header>
  <nav>
    <a href="/hx">Hx</a>
    <a href="/edit">Edit</a>
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
    <div class="big">{entry.steps}</div>
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
  nav {
    float: right;
    display: flex;
    gap: 8px;
  }
</style>
