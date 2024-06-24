import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { root } from '../index'

async function readData(id: number) {
  const data = await readFile(path.join(root, `mock/boxMessages-${id}.json`))
    .then(res => res.toString())

  return JSON.stringify(JSON.parse(data))
}

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  eventStream.push(await readData(0))

  let i = 0
  const interval = setInterval(async () => {
    i++
    if (i === 4)
      i = 0

    await eventStream.push(await readData(i))
  }, 10000)

  // cleanup the interval and close the stream when the connection is terminated
  eventStream.onClosed(async () => {
    clearInterval(interval)
    await eventStream.close()
  })

  return eventStream.send()
})
