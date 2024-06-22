import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../')
