import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'server')

export default defineNitroConfig({
  rootDir: root,
  srcDir: root,
  buildDir: path.join(root, '.nitro'),
  routeRules: {
    '/*': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
      },
    },
  },

  experimental: {
    websocket: true,
  },
})
