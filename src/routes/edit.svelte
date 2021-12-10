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
      entry: {
        id: `entry-${entryId}`,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snacks: 0,
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";

  export let entry;

  async function handleSubmit() {
    const result = await fetch("/update", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(entry),
    });
    if (result.ok) {
      goto("/");
    } else {
      alert("Error saving journal entry!");
    }
  }
</script>

<header>
  <nav style="float: right;">
    <a href="/">Cancel</a>
  </nav>
  <h1>Food Journal</h1>
</header>
<main>
  <div class="mb-2">Calories for 12/10/2021</div>
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="date">Date</label>
      <input type="date" id="date" bind:value={entry.date} />
    </div>
    <div>
      <label for="breakfast">Breakfast</label>
      <input id="breakfast" type="number" bind:value={entry.breakfast} />
    </div>
    <div>
      <label for="lunch">Lunch</label>
      <input id="lunch" type="number" bind:value={entry.lunch} />
    </div>
    <div>
      <label for="dinner">Dinner</label>
      <input id="dinner" type="number" bind:value={entry.dinner} />
    </div>
    <div>
      <label for="snacks">Snacks</label>
      <input id="snacks" type="number" bind:value={entry.snacks} />
    </div>
    <div>
      <label for="steps">Steps</label>
      <input id="steps" type="number" bind:value={entry.steps} />
    </div>
    <div>
      <button>Update</button>
    </div>
  </form>
</main>

<style>
  .mb-2 {
    margin-bottom: 20px;
  }
</style>
