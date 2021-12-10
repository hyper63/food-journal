<h1>Hyper Workshop: Food Journal</h1>
<p>Use SvelteKit and Hyper to build a Food Journal App</p>

---

## Intro

This example provides the steps to build a simple food journal application (from scratch) using Hyper and SvelteKit. It includes:

* Hyper Data: a simple and robust data service for storing journal entries
* Hyper Cache: a json document cache api to store aggregate metrics for the food journal
* SvelteKit

By the end of this guide, you'll have an app which allows users to document their calorie intake and record their
steps daily.

![Screenshot](food-journal-screenshot.png)

### Github

Whenever you get stuck at any point, take a look at [this repo](https://github.com/twilson63/food-journal)

## Project Setup

Before we start building we're going to set up our Hyper account and create a Hyper app for this project in the Hyper dashboard: https://dashboard.hyper.io.

Sign in to Hyper using your `github` account, by going to https://dashboard.hyper.io and clicking the github button, follow the sign workflow, where you will authorize Hyper to use github as and authentication service as well as provide you email information to establish your free account. Once you complete the setup process, you will be shown the Hyper developer dashboard view, in this view you want to click `Add Application` button to create a new Hyper app for this project.

## Building the app

Lets start building the SvelteKit app from scratch.

### Initialize a SvelteKit app

Using the terminal type the following SvelteKit basic commands:

> This is using the install instructions from https://kit.svelte.dev create a SvelteKit project and select the Skeleton Project Template.

``` sh
npm init svelte@next food-journal
cd food-journal
npm install
npm run dev
```

Then lets install `hyper-connect`, `date-fns`, `cuid` and `zod` as dependencies

``` sh
npm install hyper-connect
npm install zod
npm install date-fns
npm install cuid
```

Then lets install `env-cmd` as a devDependency

``` sh
npm install -D env-cmd
```

We want to save the environment variable in a `.env`. All we need is the `connection-string` that we will copy from the application view in the Hyper dashboard.

.env

``` sh
HYPER=cloud://key:secret@cloud.hyper.io/....
```

Modify the `package.json` files `scripts` section to use `env-cmd` in the `dev` script

``` json
...
scripts:{
  ...
  "dev": "env-cmd svelte-kit dev"
  ...
}
```

> If you are using `gitpod` you want to follow the following instructions to setup HMR https://gist.github.com/twilson63/3729cf6581463718c4d16f54e28a8f9d

Lets import `mvp.css` in our `src/app.html` file to get our basic styling for the application.

src/app.html

``` html
<head>
  ...
  <link rel="stylesheet" href="https://unpkg.com/mvp.css">
  %svelte.head%
</head>
```

Great! Our project is setup!

Re-Start the dev server `Ctrl-C will stop the server` and `npm run dev` will start the server.


### Creating SvelteKit Components

Every file that ends in `.svelte` is a component, in the routes folder, our application routes are defined. Lets 

Lets add these components to our project:

src/routes/index.svelte

``` svelte
<script context="module">
  import { format } from "date-fns";
  const today = format(new Date(), "MM/dd/yyyy");

  export async function load({ fetch }) {
    const result = await fetch(`/api/entries/query?date=${today}&limit=1`);

    if (result.ok) {
      return {
        props: {
          entry: await result.json().then(({ docs }) => docs[0]),
        },
      };
    }
    return {
      status: result.status,
      props: {
        entry: {},
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
    <div>12/10/2021</div>
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

```

src/routes/edit.svelte

``` svelte
<script context="module">
  export async function load({ page, fetch }) {
    const id = page.query.get('entry') 
    const result = await fetch(`/api/entries/${id}`);

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
        id,
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
  <form method="POST" action="/api/entries/{entry.id}" on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="date">Date</label>
      <input type="date" id="date" name="date" bind:value={entry.date} />
    </div>
    <div>
      <label for="breakfast">Breakfast</label>
      <input id="breakfast" type="number" name="breakfast" bind:value={entry.breakfast} />
    </div>
    <div>
      <label for="lunch">Lunch</label>
      <input id="lunch" type="number" name="lunch" bind:value={entry.lunch} />
    </div>
    <div>
      <label for="dinner">Dinner</label>
      <input id="dinner" type="number" name="dinner" bind:value={entry.dinner} />
    </div>
    <div>
      <label for="snacks">Snacks</label>
      <input id="snacks" type="number" name="snacks" bind:value={entry.snacks} />
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
</style>

```

src/routes/hx.svelte

``` svelte
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

```

src/routes/view.svelte

``` svelte
<script context="module">
  export async function load({ page, fetch }) {
    const result = await fetch(`/api/entries/${page.query.get("entry")}`);

    if (result.ok) {
      return {
        props: {
          entry: await result.json(),
        },
      };
    }
    return {
      status: result.status,
      props: {
        entry: {},
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
    <div>12/10/2021</div>
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

```

## Create our Application API

Make a directory under routes called `api` and 2 child directories called `entries` and `users`.

src/routes/api/entries/index.js

``` js
import { valid } from '$lib/entry'

export async function get() {
  return {
    status: 200,
    body: JSON.stringify([])
  }
}

export async function post({ body }) {
  return valid(body)
    .then(entry => {
      console.log(entry)
      return {
        status: 200,
        body: {
          ok: true,
          id: 'entry-user-1'
        }
      }
    })
    .catch(errors => {
      return {
        status: 500,
        body: {
          ok: false,
          errors
        }
      }
    })

}

```

src/routes/api/entries/[id].js

``` js
import { valid } from '$lib/entry'

export async function get({ params }) {
  return {
    status: 200,
    body: JSON.stringify([])
  }
}

export async function put({ params, body }) {
  return valid(body)
    .then(entry => ({ status: 200, body: { ok: true } }))
    .catch(errors => ({ status: 500, body: { ok: false, errors } }))
}

export async function del({ params }) {
  return {
    status: 200,
    body: 'OK'
  }
}

```

src/routes/api/entries/query.js

``` js
export async function get() {
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
```

src/routes/api/users/[id].js

``` js
export async function get({params}) {
  return {
    status: 200,
    body: JSON.stringify({
      id: 'user-1',
      username: 'twilson63'
    })
  }
}
```

### Add `lib` files to define our document models

Using zod, we will define our document models for our application

src/lib/entry.js

``` js
import { z } from 'zod'

const Entry = z.object({
  id: z.string(),
  type: z.literal('entry').default('entry'),
  userId: z.string(),
  date: z.string(),
  calories: z.number().nonnegative(),
  steps: z.number().nonnegative(),
  breakfast: z.number().nonnegative(),
  lunch: z.number().nonnegative(),
  dinner: z.number().nonnegative(),
  snacks: z.number().nonnegative(),
  created: z.string(),
  modified: z.string()

})

export function valid(entry) {
  const { success, data, error } = Entry.safeParse(entry)
  return success ? Promise.resolve(data) : Promise.reject(error.format())
}

```

src/lib/user.js

``` js
import { z } from 'zod'

const User = z.object({
  id: z.string(),
  username: z.string()
})

export function valid(data) {
  const { success, data, error } = User.safeParse(data)
  return success ? Promise.resolve(data) : Promise.reject(error.format())
}
```

### Add/Edit Food Journal Entry

### Query Food Journal Entry by Date

### List Food Journal Entry

### Create Food Journl Entry for previous date

### Get Food Journal Entry by id

### Build average Calories and Steps Metrics

## Bonus: Add User Auth

### Setup

### Configure hooks and cookie sessions
