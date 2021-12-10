<script>
  import { onMount } from 'svelte';
  import { goto } from "$app/navigation";
  import { format } from 'date-fns'

  $: record = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  };
  
  const entryId = format(new Date(), 'yyyyMMdd')

  onMount(async () => {
    let result = await fetch(`/get?entry=${entryId}`)
    if (result.ok) {
      record = await result.json()
      console.log(record)
    }
  })

  async function handleSubmit() {
    const result = await fetch("/update", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: `entry-${entryId}`, 
        ...record
      }),
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
      <label for="breakfast">Breakfast</label>
      <input id="breakfast" type="number" bind:value={record.breakfast} />
    </div>
    <div>
      <label for="lunch">Lunch</label>
      <input id="lunch" type="number" bind:value={record.lunch} />
    </div>
    <div>
      <label for="dinner">Dinner</label>
      <input id="dinner" type="number" bind:value={record.dinner} />
    </div>
    <div>
      <label for="snacks">Snacks</label>
      <input id="snacks" type="number" bind:value={record.snacks} />
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
