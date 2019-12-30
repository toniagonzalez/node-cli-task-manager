const EventEmitter = require('events');
const readline  = require('readline');

//establish read/write interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//create client event
const client = new EventEmitter();

//require server event
const server = require('./server')(client);

//listen for server response to client
server.on('response', (res) => {
    //clear terminal
    process.stdout.write('\u001B[2J\u001B[0;0f')
    //write response
    process.stdout.write(res);
    //write prompt for next command
    process.stdout.write('\n\>');

})

//pass commands and arguments from client to server
let command, args;
rl.on('line', (input) => {
    [command, ...args] = input.split(' ');
    client.emit('command', command, args);
})
