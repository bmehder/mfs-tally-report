export const printToConsole = data => {
  const { endPoint, fetchedData } = data
  // console.clear()
  // queueMicrotask(console.log.bind(console, '%cRequest', 'font-weight: bold;'))
  queueMicrotask(console.log.bind(console, endPoint + '\n\n'))
  // queueMicrotask(console.log.bind(console, '%cResponse', 'font-weight: bold;'))
  // queueMicrotask(
  //   console.log.bind(console, JSON.stringify(fetchedData, null, 4))
  // )
}
