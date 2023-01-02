import assert from 'assert'
import { ChatServer } from "../src/chatserver.js"
import { db } from '../src/db/db.js'

export const chatServerTest = async () => {

    await db.initializeDB()

    const user1Id = 1
    const token1 = 'testing'
    const dbUser1 = {
        id: user1Id,
        username: 'user1',
        password: '12345',
        email: 'user1@host.com',
        highscore: 0
    }

    const socket1Id = 1
    const chatUser1 = {
        socketId: socket1Id,
        user: dbUser1,
        token: token1,
        score: 100
    }

    const socket2Id = 2
    const chatUser2 = {
        socketId: socket2Id,
        user: dbUser1,
        token: token1,
        score: 0
    }


    // check users table
    assert.deepEqual(ChatServer.users.length, 0, 'There should be no users before the first user is added')


    // add first user to ChatServer
    ChatServer.addUser(chatUser1)
    assert.deepEqual(ChatServer.users.length, 1, 'Should be one user')
    assert.deepEqual(ChatServer.users[0], chatUser1, 'Should be the same user in table')


    // get user by socket id
    assert.deepEqual(ChatServer.getUserBySocketId(socket1Id), chatUser1, 'Should be the same user added to ChatServer')


    // can update highscore?
    assert.ok(ChatServer.canUpdateHighscore(user1Id, 10000), 'Should be truthy')
    assert.ok(!ChatServer.canUpdateHighscore(user1Id, 20000), 'Should not be truthy')


    // remove user from ChatServer by socket id
    ChatServer.removeUserBySocketId(socket1Id)
    assert.deepEqual(ChatServer.users.length, 0, 'There should be no users')


    // remove user from ChatServer by user id
    ChatServer.addUser(chatUser1)
    ChatServer.addUser(chatUser2)
    assert.deepEqual(ChatServer.users.length, 2, 'Should be two users')
    ChatServer.removeUserByUserId(user1Id)
    assert.deepEqual(ChatServer.users.length, 0, 'There should be no users')


    // prepare instance of ChatServer
    const chatServer1 = new ChatServer()


    // prepare mocks
    const mockCalback1 = () => {}
    let mockEmit1 = false
    const mockSocket1 = {
        id: 1,
        emit() {
            mockEmit1 = true
        } 
    }
    const mockData1 = {
        user: dbUser1,
        token: token1
    }
    let mockIoEmit1 = false 
    chatServer1.io.emit = () => { 
        mockIoEmit1 = true
    }


    // try to log in to chat server when user is not in db
    await chatServer1.socketLoginServer(mockSocket1, mockData1, mockCalback1)
    assert.deepEqual(ChatServer.users.length, 0, 'There should be no users because user is not in db')


    // try to login to chat server when user is in db but not logged in - no token in db
    await db.addUser(dbUser1)
    await chatServer1.socketLoginServer(mockSocket1, mockData1, mockCalback1)
    assert.deepEqual(ChatServer.users.length, 0, 'There should be no users because user is not logged in')


    // login to chat server when user is in db and is logged in
    await db.addToken(user1Id, token1)
    await chatServer1.socketLoginServer(mockSocket1, mockData1, mockCalback1)
    assert.deepEqual(ChatServer.users.length, 1, 'There should be one user')

    
    // update username
    const dbUser2 = { ...dbUser1 }
    dbUser2.username = 'user2'
    await db.updateUser(dbUser2)
    await chatServer1.socketUpdateUsername(mockSocket1)
    assert.deepEqual(ChatServer.users[0].user.username, 'user2', 'Should get new username from db')


    // try to update score more than 11000 points
    chatServer1.socketUpdateScore(mockSocket1, 20000)
    assert.deepEqual(ChatServer.users[0].score, 0, 'Should not be changed')


    // update score less than 11000 points
    chatServer1.socketUpdateScore(mockSocket1, 10500)
    assert.deepEqual(ChatServer.users[0].score, 10500, 'Should be changed')


    // send message to the server
    chatServer1.socketMessageServer(mockSocket1, { text: 'testing' })
    assert.ok(mockIoEmit1, 'Should call chatServer1.io.emit method')

        
    // logout of the chat
    chatServer1.socketLogoutServer(mockSocket1)
    assert.deepEqual(ChatServer.users.length, 0, 'There should be no users')


    // try to send message when user is logged out
    chatServer1.socketMessageServer(mockSocket1, { text: 'testing' })
    assert.ok(mockEmit1, 'Should call mockSocket1.emit method')

}