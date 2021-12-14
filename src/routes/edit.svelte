<script context="module">
  import { format } from "date-fns";

  const today = format(new Date(), "yyyy-MM-dd");

  export async function load({ page, fetch }) {
    const id = page.query.get("entry");
    const result = await fetch(`/api/entries/${id}`);
    if (result.ok) {
      return {
        props: {
          entry: await result.json(),
        },
      };
    }
    return {
      props: {
        entry: {
          id,
          date: today,
          calories: 0,
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          snacks: 0,
          steps: 0,
        },
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";

  export let entry;
  let error;

  async function handleSubmit() {
    error = null;
    const result = await fetch(`/api/entries/${entry.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(entry),
    });
    if (result.ok) {
      goto("/");
    } else {
      error = JSON.stringify((await result.json()).errors.fieldErrors);
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
  <div class="mb-2">Calories for {entry.date}</div>
  {#if error}
    <div class="error">
      Error(s) occured when trying to submit your journal entry.
      <br />
      {error}
    </div>
  {/if}
  <form
    method="POST"
    action="/api/entries/{entry.id}"
    on:submit|preventDefault={handleSubmit}
  >
    <div>
      <label for="date">Date</label>
      <input type="date" id="date" name="date" bind:value={entry.date} />
    </div>
    <div>
      <label for="breakfast">Breakfast</label>
      <input
        id="breakfast"
        type="number"
        name="breakfast"
        bind:value={entry.breakfast}
      />
    </div>
    <div>
      <label for="lunch">Lunch</label>
      <input id="lunch" type="number" name="lunch" bind:value={entry.lunch} />
    </div>
    <div>
      <label for="dinner">Dinner</label>
      <input
        id="dinner"
        type="number"
        name="dinner"
        bind:value={entry.dinner}
      />
    </div>
    <div>
      <label for="snacks">Snacks</label>
      <input
        id="snacks"
        type="number"
        name="snacks"
        bind:value={entry.snacks}
      />
    </div>
    <div>
      <label for="steps">Steps</label>
      <input id="steps" type="number" name="steps" bind:value={entry.steps} />
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
  .error {
    margin: 8px 0 16px 0;
    padding: 40px;
    background: red;
    border-radius: 8px;
    color: white;
  }
</style>
