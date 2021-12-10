<script context="module">
  export async function load({ fetch }) {
    const result = await fetch("/entries");
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
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { format, parseISO } from "date-fns";

  export let entries;
  let date = format(new Date(), "yyyyMMdd");
  async function handleSubmit() {
    console.log(date);
    const entryId = format(parseISO(date), "yyyyMMdd");
    goto(`/edit?entry=entry-${entryId}`);
  }
</script>

<header>
  <a class="home" href="/">back</a>
  <h1>Food Journal</h1>
</header>
<main>
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
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="date">Date</label>
      <input id="date" type="date" bind:value={date} />
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
