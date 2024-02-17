import { WebSocketServer, WebSocket } from 'ws'
import 'dotenv/config'

import { httpServer } from './src/http_server'
import { handleConnection } from './src/websocket'

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8181', 10)
const WEBSOCKET_PORT = parseInt(process.env.WEBSOCKET_PORT || '3000', 10)

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
  clientTracking: true,
})

wss.on('connection', handleConnection)
