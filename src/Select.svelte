<script>
  import { scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  export let options = null
  export let value = null
</script>

<select
  bind:value
  on:change
  in:scale={{ delay: 400, opacity: 0.52 }}
  out:scale={{ duration: 200, opacity: 0.52, easing: quintOut }}
>
  {#each options as { value, name }}
    <option {value}>{name}</option>
  {/each}
</select>

<style>
  select {
    -webkit-padding: 0.5em 0;
    padding: 0.5rem;
    font-family: inherit;
    font-size: inherit;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    user-select: none;
  }
  @media screen and (max-width: 600px) {
    select {
      width: 20%;
    }
  }
</style>
