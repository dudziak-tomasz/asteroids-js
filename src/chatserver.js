import { Server } from 'socket.io'
import validator from 'validator'
import { db } from './db/db.js'

export class ChatServer {

    static users = new Map()

    constructor(server, params) {    
        this.io = new Server(server, params)
        this.io.on('connection', (socket) => this.ioConnection(socket))
    }

    ioConnection(socket) {
        socket.on('loginserver', (data, callback) => this.socketLoginServer(socket, data, callback))
        socket.on('messageserver', (message) => this.socketMessageServer(socket, message))
        socket.on('updatescore', (score) => this.socketUpdateScore(socket, score))
        socket.on('updateusername', () => this.socketUpdateUsername(socket))
        socket.on('logoutserver', () => this.socketLogoutServer(socket))
        socket.on('disconnect', () => this.socketDisconnect(socket))
    }

    async socketLoginServer(socket, data, callback) {
        try {
            if (ChatServer.getUserBySocketId(socket.id)) return

            const dbToken = await db.findToken(data.user.id, data.token)
            if (!dbToken) throw new Error()

            const dbUser = await db.findUserById(data.user.id)
            if (!dbUser) throw new Error()

            const newUser = {
                socketId: socket.id,
                user: data.user,
                token: data.token,
                score: 0
            }
            newUser.user.username = dbUser.username

            ChatServer.addUser(newUser)

            callback(undefined, { username: 'admin', text: `hello @${data.user.username}!`, time: Date.now() })
        } catch {
            callback({ username: 'admin', text: 'please login first', time: Date.now() }, undefined)
        }
    }    

    async socketUpdateUsername(socket) {
        try {
            const chatUser = ChatServer.getUserBySocketId(socket.id)
            if (!chatUser) return

            const dbUser = await db.findUserById(chatUser.user.id)
            if (!dbUser) throw new Error()

            chatUser.user.username = dbUser.username
            ChatServer.users.set(socket.id, chatUser)
        } catch {

        }
    }

    socketMessageServer(socket, message) {
        const user = ChatServer.getUserBySocketId(socket.id)
        if (user) {
            const messageText = validator.escape(message.text).slice(0, 225)
            this.io.emit('messageclient', { username: user.user.username, text: messageText, time: Date.now() })
        } else {
            socket.emit('messageclient', { username: 'admin', text: 'please login first', time: Date.now() })
        }
        
    }    

    socketUpdateScore(socket, score) {
        const chatUser = ChatServer.getUserBySocketId(socket.id)
        if (chatUser && score - chatUser.score <= 11000) {
            chatUser.score = score
            ChatServer.users.set(socket.id, chatUser)
        }
    }

    socketLogoutServer(socket) {
        ChatServer.removeUserBySocketId(socket.id)
    }

    socketDisconnect(socket) {
        this.socketLogoutServer(socket)
    }

    static addUser(user) {
        if (!ChatServer.users.has(user.socketId)) ChatServer.users.set(user.socketId, user)
    }

    static removeUserBySocketId(socketId) {
        ChatServer.users.delete(socketId)
    }

    static removeUserByUserId(userId) {
        ChatServer.users.forEach(user => user.user.id === userId ? ChatServer.users.delete(user.socketId) : 0)
    }

    static getUserBySocketId(socketId) {
        return ChatServer.users.get(socketId)
    }

    static canUpdateHighscore(userId, newHighscore) {
        const users = [...ChatServer.users.values()]
        return users.some((user) => user.user.id === userId && newHighscore - user.score <= 10000)
    }

}