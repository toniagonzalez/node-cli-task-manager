const EventEmitter = require('events');

class Server extends EventEmitter {   
    constructor(client) {
        super();
        this.tasks = {};
        this.taskId = 1;
        //creates inital prompt
        process.nextTick(() => {
            this.emit(
                'response',
                'Type a command (help to list commands)'
            )
        })
        //switch to handle invalid commands
        client.on('command', (command, args) => {
            switch(command) {
                case 'help':
                case 'add':
                case 'ls':
                case 'delete':
                case 'quit':
                    this[command](args);
                    break;
                default:
                    this.emit('response', 'Unknown command...');
            }
        })
    }

    //creates string list of task object
    tasksString(){
        return Object.keys(this.tasks).map(key => {
            return `${key}: ${this.tasks[key]}`;            
        }).join('\n');
    }

    //Lists available commands
    help() {
        this.emit('response', `Available Commands:\n 
        add -add followed by task to add\n
        ls -lists files\n
        delete -delete followed by id of file\n
        quit -to end program`
        );
    }

    //adds new item to task object
    add(args) {
        this.tasks[this.taskId] = args.join(' ');
        this.emit('response', `Added task ${this.taskId}`);
        this.taskId++;
    }

    //returns task string
    ls() {
        this.emit('response', `Tasks:\n${this.tasksString()}`);
    }

    //removes item from task object by id
    delete(args) {
        delete(this.tasks[args[0]]);
        this.emit('response', `Deleted task ${args[0]}`);
    }

    //exits program
    quit() {
        this.emit('response', process.exit(0))
    }
}

module.exports = (client) => new Server(client);