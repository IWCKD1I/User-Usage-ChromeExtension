//import database 
var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/ChromeExt");

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log(`${message}`);
    });

    ws.on('close', (event) => {
        ws.send('setVariable');
        console.log("WebSocket closed with code " + event.code + " and reason " + event.reason);

    });

});