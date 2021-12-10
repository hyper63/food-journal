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



## Bonus: Add User Auth