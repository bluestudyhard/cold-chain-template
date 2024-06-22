import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { root } from '../index'

export default defineEventHandler(async (event) => {
  const data = await readFile(path.join(root, 'mock/boxMessages.json'))

  return data
})
