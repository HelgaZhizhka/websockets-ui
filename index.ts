import 'dotenv/config'

import { httpServer } from './src/http_server'

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8181', 10)

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)