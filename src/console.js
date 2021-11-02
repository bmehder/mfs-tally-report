export const printToConsole = data => {
  const { startDate, endDate, endPoint, fetchedData } = data
  console.clear()
  queueMicrotask(
    console.log.bind(console, '%c\nStart Date | End Date', 'font-weight: bold;')
  )
  queueMicrotask(
    console.log.bind(console, startDate + '   ' + endDate + '\n\n')
  )
  queueMicrotask(console.log.bind(console, '%cRequest', 'font-weight: bold;'))
  queueMicrotask(console.log.bind(console, endPoint + '\n\n'))
  queueMicrotask(console.log.bind(console, '%cResponse', 'font-weight: bold;'))
  queueMicrotask(
    console.log.bind(console, JSON.stringify(fetchedData, null, 4))
  )
}
