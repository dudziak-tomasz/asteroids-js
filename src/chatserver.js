import { Server } from 'socket.io'

export class ChatServer {

    static users = []

    constructor(server, params) {    

        this.io = new Server(server, params)
        
        this.io.on('connection', (socket) => this.ioConnection(socket))

    }

    ioConnection(socket) {
        
        ChatServer.addUser(socket.id)
        // console.log('a user connected', socket.id, ChatServer.getUser(socket.id))

        // socket.emit('messageclient', 'admin: hi')
        // socket.broadcast.emit('messageclient', socket.id + ' has joined chat')

        socket.on('messageserver', (message) => this.socketMessageServer(socket, message))

        socket.on('disconnect', () => this.socketDisconnect(socket))
    }

    socketMessageServer(socket, message) {
        if (message.user) {
            this.io.emit('messageclient', { username: message.user.username, text: message.text, time: Date.now() })
            // this.io.emit('messageclient', { username: 'admin', text: 'message sent' })
        } else {
            socket.emit('messageclient', { username: 'admin', text:'please login first', time: Date.now() })
        }
        
    }    

    socketDisconnect(socket) {
        // console.log('a user disconnected', socket.id)
        // this.io.emit('messageclient', socket.id + ' has left chat')
        ChatServer.removeUser(socket.id)
    }

    static addUser(user) {
        ChatServer.users.push(user)
        // console.log(ChatServer.users)
    }

    static removeUser(user) {
        let index = ChatServer.users.indexOf(user)
        if (index !== -1) ChatServer.users.splice(index, 1)
        // console.log(ChatServer.users)
    }

    static getUser(user) {
        return ChatServer.users.find((u) => u === user)
    }
}