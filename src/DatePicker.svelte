<script>
  import { scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  export let value
</script>

<input
  type="date"
  bind:value
  in:scale={{ delay: 400, opacity: 0.52 }}
  out:scale={{ duration: 200, opacity: 0.52, easing: quintOut }}
/>

<style>
  input {
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    font-family: inherit;
    font-size: inherit;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  @media screen and (max-width: 600px) {
    input {
      width: 20%;
    }
  }
</style>
