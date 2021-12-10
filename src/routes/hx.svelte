<script context="module">
  import { format } from "date-fns";

  let date = format(new Date(), "yyyyMMdd");

  export async function load({ fetch }) {
    const result = await fetch("/api/entries");
    if (result.ok) {
      return {
        props: {
          entries: await result.json(),
        },
      };
    }

    return {
      props: {
        entries: [],
        date,
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";

  export let entries;
  export let date;

  async function handleSubmit() {
    const result = await fetch("/api/entries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date }),
    });
    if (result.ok) {
      const { id } = await result.json();
      return goto(`/edit?entry=${id}`);
    }
    alert("ERROR: could not create or find entry!");
  }
</script>

<header>
  <a class="home" href="/">back</a>
  <h1>Food Journal</h1>
</header>
<main>
  <h4>Stats</h4>
  <section>
    <aside>
      Avg Calories
      <h3>1700</h3>
    </aside>
    <aside>
      Avg Steps
      <h3>11759</h3>
    </aside>
  </section>
  <h4>History</h4>
  <table>
    <tr>
      <th> Date </th>
      <th> Calories </th>
      <th> Steps </th>
      <th> View </th>
    </tr>
    {#each entries as entry}
      <tr>
        <td>{entry.date}</td>
        <td>{entry.calories}</td>
        <td>{entry.steps}</td>
        <td><a href="/?entry={entry.id}">view</a></td>
      </tr>
    {/each}
  </table>
  <hr />
  <h2>Record Day</h2>
  <form
    method="POST"
    action="/api/entries"
    on:submit|preventDefault={handleSubmit}
  >
    <div>
      <label for="date">Date</label>
      <input id="date" name="date" type="date" bind:value={date} />
    </div>
    <div>
      <button type="submit">Record</button>
    </div>
  </form>
</main>

<style>
  .home {
    float: right;
  }
</style>
