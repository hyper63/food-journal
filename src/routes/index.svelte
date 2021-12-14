<script context="module">
  import { format } from "date-fns";
  import { newEntry } from "$lib/entry";

  const today = format(new Date(), "yyyy-MM-dd");

  export async function load({ fetch }) {
    const result = await fetch(`/api/entries/query?date=${today}&limit=1`);

    if (result.ok) {
      let entry = await result.json().then(({ docs }) => docs[0]);
      if (!entry) {
        entry = newEntry();
      }
      return {
        props: {
          entry,
        },
      };
    }
    return {
      status: result.status,
      props: {
        entry: newEntry(),
      },
    };
  }
</script>

<script>
  export let entry;
</script>

<header>
  <nav>
    <a href="/hx">Hx</a>
    <a href="/edit?entry={entry.id}">Edit</a>
  </nav>
  <h1>Food Journal</h1>
</header>
<main>
  <section>
    <div>Calories for</div>
    <div>{entry.date}</div>
    <div class="big">{entry.calories}</div>
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
