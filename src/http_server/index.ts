import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import 'dotenv/config'
import { WebSocketServer } from 'ws'

import { handleConnection } from '../websocket';

const WEBSOCKET_PORT = parseInt(process.env.WEBSOCKET_PORT || '3000', 10)

export const httpServer = http.createServer((req, res) => {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
  clientTracking: true,
})

wss.on('connection', handleConnection)