<script>
  // Data structures and util functions
  import { chartTypes } from './chartTypes'
  import { printToConsole } from './console'

  // Svelte components
  import Spinner from './Spinner.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  // App state
  const PASSWORD = '02242017'

  let chartType = 'bar'
  let sumOfAllData = 0
  let isLoading = false
  let isAuthorized = false
  let enteredValue = ''
  let error = ''
  let fetchedData = null

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
  sessionStorage.getItem('chartType') &&
    (chartType = sessionStorage.getItem('chartType'))

  sessionStorage.getItem('isAuthorized') &&
    (isAuthorized = sessionStorage.getItem('isAuthorized'))

  // Setters for chart settings in session storage
  $: sessionStorage.setItem('chartType', chartType)
  $: sessionStorage.setItem('isAuthorized', isAuthorized)

  const handleLogin = () => {
    return enteredValue === PASSWORD
      ? (isAuthorized = true)
      : (isAuthorized = false)
  }

  const sumAllData = (node, fetchedData) => {
    const getSumOfAllData = () => {
      sumOfAllData = fetchedData.datasets
        .map(dataset => dataset.data.reduce((total, next) => (total += next)))
        .reduce((total, next) => (total += next))
    }

    getSumOfAllData()

    return {
      update(fetchedData) {
        getSumOfAllData()
      },
      destroy() {
        sumOfAllData = 0
      },
    }
  }

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
      <div>
        <span>💩</span><br />Don't panic, but...<br /><code>{error}</code>
      </div>
    {/if}

    {#if fetchedData}
      <Chart config={chartConfig} />

      <aside use:sumAllData={fetchedData}>
        {sumOfAllData} total /
        {(sumOfAllData / fetchedData.labels.length).toFixed(2)} avg /
        {((sumOfAllData / (fetchedData.labels.length * 10)) * 100).toFixed(1)}%
        of goal
      </aside>
    {/if}
  </main>

  <footer>
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

  aside {
    width: 100%;
    display: flex;
    justify-content: space-around;
    font-size: 2vw;
  }

  div {
    width: 70%;
    color: red;
    font-size: 4vw;
  }

  code {
    color: initial;
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
