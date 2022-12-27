import { Server } from 'socket.io'
import validator from 'validator'

export class ChatServer {

    static users = []

    constructor(server, params) {    

        this.io = new Server(server, params)
        
        this.io.on('connection', (socket) => this.ioConnection(socket))

    }

    ioConnection(socket) {
        
        ChatServer.addUser(socket.id)

        socket.on('messageserver', (message) => this.socketMessageServer(socket, message))

        socket.on('disconnect', () => this.socketDisconnect(socket))
    }

    socketMessageServer(socket, message) {
        if (message.user) {
            const messageText = validator.escape(message.text)
            this.io.emit('messageclient', { username: message.user.username, text: messageText, time: Date.now() })
        } else {
            socket.emit('messageclient', { username: 'admin', text:'please login first', time: Date.now() })
        }
        
    }    

    socketDisconnect(socket) {
        ChatServer.removeUser(socket.id)
    }

    static addUser(user) {
        ChatServer.users.push(user)
    }

    static removeUser(user) {
        let index = ChatServer.users.indexOf(user)
        if (index !== -1) ChatServer.users.splice(index, 1)
    }

    static getUser(user) {
        return ChatServer.users.find((u) => u === user)
    }
}