import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { root } from '../index'

export default defineEventHandler((event) => {
  const eventStream = createEventStream(event)

  let i = 0
  // Send a message every second
  const interval = setInterval(async () => {
    const data = await readFile(path.join(root, `mock/boxMessages-${i}.json`))
      .then(res => res.toString())

    i++
    if (i === 3) {
      i = 0
    }

    await eventStream.push(JSON.stringify(JSON.parse(data)))
  }, 3000)

  // cleanup the interval and close the stream when the connection is terminated
  eventStream.onClosed(async () => {
    clearInterval(interval)
    await eventStream.close()
  })

  return eventStream.send()
})
