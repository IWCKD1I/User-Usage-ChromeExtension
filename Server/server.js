//import database 
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ChromeExt');
console.log(mongoose.connection.readyState);
//Defining Models
var Schema = mongoose.Schema;
var InputSchema = new Schema({
    Domain: String,
    StartTime: String
});
Input = mongoose.model('Client_Inputs', InputSchema);


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });



wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (data) => {
        const parsedData = JSON.parse(data);
        const SaveInput = new Input({ Domain: parsedData.domain, StartTime: parsedData.StartTime });
        SaveInput.save().then(console.log(` ${parsedData.domain} at ${parsedData.StartTime}`));
    });

    ws.on('close', (event) => {
        ws.send('setVariable');
        console.log("WebSocket closed with code " + event.code + " and reason " + event.reason);

    });

});