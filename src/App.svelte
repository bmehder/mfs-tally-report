<script>
  // Data structures and util functions
  import { chartTypes } from './chartTypes'
  import { reports } from './reportOptions'
  import { printToConsole } from './console'

  // Svelte components
  import Spinner from './Spinner.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'
  import Display from './Display.svelte'
  import Error from './Error.svelte'

  let chartType = 'bar'
  let isLoading = false
  let isDataGroupedByLabel = true
  let error = ''
  let fetchedData = null
  let date = 'spring'

  $: chartConfig = {
    type: chartType,
    data: fetchedData,
  }

  $: consoleData = {
    endPoint,
    fetchedData,
  }

  $: endPoint = `https://myfunscience.com/wp-admin/?report=tally&date=${date}`

  // Getters for chart settings in session storage
  localStorage.getItem('chartType') &&
    (chartType = localStorage.getItem('chartType'))

  // Setters for chart settings in session storage
  $: localStorage.setItem('chartType', chartType)

  const makeAPIRequest = (node, endPoint) => {
    const getData = async endPoint => {
      error = null
      fetchedData = null

      isLoading = true

      try {
        const res = await fetch(endPoint)
        const data = await res.json()
        fetchedData = data
      } catch (err) {
        isLoading = false
        error = err
      }

      isLoading = false
    }

    getData(endPoint).then(() => printToConsole(consoleData))

    return {
      update(endPoint) {
        getData(endPoint).then(() => printToConsole(consoleData))
      },
    }
  }
</script>

<svelte:window
  on:keypress={e => e.key === 'Enter' && makeAPIRequest(null, endPoint)}
/>

<main use:makeAPIRequest={endPoint}>
  {#if !fetchedData && !error}
    <Spinner />
  {/if}

  {#if error}
    <Error {error} />
  {/if}

  {#if fetchedData}
    <Chart config={chartConfig} />
    <Display {fetchedData} {isDataGroupedByLabel} />
  {/if}
</main>

<footer>
  <Select bind:value={date} options={reports} />
  <Select bind:value={chartType} options={chartTypes} />
  <Refresher on:click={() => makeAPIRequest(null, endPoint)} {isLoading} />
</footer>

<style>
  main {
    height: 85vh;
    display: grid;
    place-items: center;
    padding: 0 2rem;
    background: white;
    text-align: center;
  }

  footer {
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: #323232;
    color: white;
  }
</style>
