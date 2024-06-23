import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)))

const {
  VITE_LOCATION_KEY: mapKey,
} = process.env

if (!mapKey) {
  console.error('高德地图 key 不存在')
  process.exit(1)
}

export default defineNitroConfig({
  rootDir: root,
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

  appConfig: {
    mapKey,
  },

  experimental: {
    websocket: true,
  },
})
