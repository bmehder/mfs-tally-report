<script>
  import { scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  export let isLoading = false
</script>

<span
  class:isLoading
  on:click
  in:scale={{ delay: 400, opacity: 0.52 }}
  out:scale={{ duration: 200, opacity: 0.52, easing: quintOut }}>&#x21bb;</span
>

<style>
  span {
    font-size: 3rem;
    color: #f4f4f4;
    cursor: pointer;
    user-select: none;
    max-width: 20%;
  }
  .isLoading {
    transform-origin: center;
    animation: spin 2s infinite;
    animation-delay: 200ms;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
