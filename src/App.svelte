<script>
  // Data structures, util and transition functions
  import { chartTypes } from './chartTypes'
  import { reports } from './reports'
  import { printToConsole } from './console'

  // Svelte components
  import Spinner from './Spinner.svelte'
  import DatePicker from './DatePicker.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  // App state
  const TODAY = new Date().toISOString().slice(0, 10)
  const PASSWORD = '02242017'

  let startDate = '2021-07-18'
  let endDate = TODAY
  let chartType = 'bar'
  let report = 'report-1'
  let domain = 'restoreosteo'
  let isLoading = false
  let fetchedData = null
  let totalAppointments = 0
  let totalMonthlyAppointments = []
  let error
  let isAuthorized = true
  let enteredValue = ''

  // $: isAuthorized = enteredValue === PASSWORD

  $: chartConfig = {
    type: chartType,
    data: fetchedData,
  }

  $: consoleData = {
    startDate,
    endDate,
    endPoint,
    fetchedData,
  }

  $: domain = report === 'report-2' ? 'primeregen' : 'restoreosteo'

  // $: endPoint = `https://${domain}.com/?report=${report}&startDate=${startDate}&endDate=${endDate}`
  $: endPoint = `api/get.json`

  // Getters for chart settings in session storage
  sessionStorage.getItem('report') &&
    (report = sessionStorage.getItem('report'))

  sessionStorage.getItem('chartType') &&
    (chartType = sessionStorage.getItem('chartType'))

  sessionStorage.getItem('startDate') &&
    (startDate = sessionStorage.getItem('startDate'))

  sessionStorage.getItem('endDate') &&
    (endDate = sessionStorage.getItem('endDate'))

  // Setters for chart settings in session storage
  $: sessionStorage.setItem('report', report)
  $: sessionStorage.setItem('chartType', chartType)
  $: sessionStorage.setItem('startDate', startDate)
  $: sessionStorage.setItem('endDate', endDate)

  // Keep dates within a logical range
  $: startDate < '2021-07-18' && (startDate = '2021-07-18')
  $: endDate < '2021-07-18' && (endDate = '2021-07-18')
  $: startDate > TODAY && (startDate = TODAY)
  $: endDate > TODAY && (endDate = TODAY)

  // Predicates
  $: isInvalidDateRange = endDate < startDate

  const sumAllAppointmentsByMonth = node => {
    totalMonthlyAppointments = []
    for (let i = 0; i < fetchedData.labels.length; i++) {
      totalMonthlyAppointments = [
        ...totalMonthlyAppointments,
        fetchedData.datasets
          .map(dataset => dataset.data[i])
          .reduce((total, next) => (total += next)),
      ]
    }
    return {
      destroy() {
        totalMonthlyAppointments = []
      },
    }
  }

  const sumAllAppointments = (node, fetchedData) => {
    const getTotalAppointments = () => {
      totalAppointments = fetchedData.datasets
        .map(dataset => dataset.data.reduce((total, next) => (total += next)))
        .reduce((total, next) => (total += next))
    }

    getTotalAppointments()

    return {
      update(fetchedData) {
        getTotalAppointments()
      },
      destroy() {
        totalAppointments = 0
      },
    }
  }

  const makeAPIRequest = (node, endPoint) => {
    if (isInvalidDateRange) {
      alert('The end date cannot be before the start date.')
      return
    }

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
    <input
      name="password"
      bind:value={enteredValue}
      placeholder="Enter password..."
    />
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

      <aside use:sumAllAppointments={fetchedData}>
        {`${totalAppointments} total`} /
        {`${(totalAppointments / fetchedData.labels.length).toFixed(2)} avg`}
      </aside>
    {/if}
  </main>

  <footer>
    {#key report}
      <Select bind:value={chartType} options={chartTypes} />
      <Refresher on:click={() => makeAPIRequest(null, endPoint)} {isLoading} />
    {/key}
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
