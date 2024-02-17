import { WebSocket } from 'ws'
// import { handleClientMessage } from './handleClientMessage' 

export const handleConnection = (ws: WebSocket) => {
  console.log('New client connected!')

  ws.on('message', (message: { data: string }) => {
    // handleClientMessage(ws, message.data)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })

  ws.send(JSON.stringify({ data: 'Hello from server!' }))
}
