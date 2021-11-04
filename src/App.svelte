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

  // App state
  const PMONEY = '02242017'

  let chartType = 'bar'
  let isLoading = false
  let isAuthorized = false
  let isDataGroupedByLabel = true
  let enteredValue = ''
  let error = ''
  let fetchedData = null
  let report = 'report-1'

  $: chartConfig = {
    type: chartType,
    data: fetchedData,
  }

  $: consoleData = {
    endPoint,
    fetchedData,
  }

  // $: endPoint = `https://${domain}.com/?report=${report}&startDate=${startDate}&endDate=${endDate}`
  $: endPoint = `api/get.json`

  // Getters for chart settings in session storage
  localStorage.getItem('chartType') &&
    (chartType = localStorage.getItem('chartType'))

  localStorage.getItem('isAuthorized') &&
    (isAuthorized = localStorage.getItem('isAuthorized'))

  // Setters for chart settings in session storage
  $: localStorage.setItem('chartType', chartType)
  $: localStorage.setItem('isAuthorized', isAuthorized)

  const handleLogin = () => {
    return enteredValue === PMONEY
      ? (isAuthorized = true)
      : (isAuthorized = false)
  }

  // const sumAllData = (node, fetchedData) => {
  //   const getSumOfAllData = () => {
  //     sumOfAllData = fetchedData.datasets
  //       .map(dataset => dataset.data.reduce((total, next) => (total += next)))
  //       .reduce((total, next) => (total += next))
  //   }

  //   getSumOfAllData()

  //   return {
  //     update(fetchedData) {
  //       getSumOfAllData()
  //     },
  //     destroy() {
  //       sumOfAllData = 0
  //     },
  //   }
  // }

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

{#if !isAuthorized}
  <section>
    <div>
      <input
        name="password"
        bind:value={enteredValue}
        placeholder="Enter password..."
      />
      <button on:click={handleLogin}>Login</button>
    </div>
  </section>
{/if}

{#if isAuthorized}
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
    <!-- <Select bind:value={report} options={reports} /> -->
    <Select bind:value={chartType} options={chartTypes} />
    <Refresher on:click={() => makeAPIRequest(null, endPoint)} {isLoading} />
  </footer>
{/if}

<style>
  section {
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: #307ad5;
  }

  input {
    padding: 1rem 1.5rem;
    border: none;
    outline: none;
  }

  section div {
    display: flex;
    justify-content: center;
  }

  section button {
    padding: 1rem 1.5rem;
  }

  main {
    height: 85vh;
    display: grid;
    place-items: center;
    padding: 0 2rem;
    background: white;
    text-align: center;
  }

  div {
    width: 70%;
    color: red;
    font-size: 4vw;
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

  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :global(body) {
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }
</style>
