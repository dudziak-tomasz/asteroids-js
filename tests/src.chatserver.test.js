import assert from 'assert'
import { ChatServer } from "../src/chatserver.js"
import { db } from '../src/db/db.js'

export const chatServerTest = async () => {

    // Delete data from db
    await db.initializeDB()

    // Prepare test data
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


    // Should be no users before the first user is added
    {
        assert.deepEqual(ChatServer.users.size, 0, 'There should be no users before the first user is added')
    }


    // add first user to ChatServer
    {
        ChatServer.addUser(chatUser1)
        assert.deepEqual(ChatServer.users.size, 1, 'Should be one user')
        assert.deepEqual(ChatServer.users.get(chatUser1.socketId), chatUser1, 'Should be the same user in table')    
    }


    // get user by socket id
    {
        const chatUser = ChatServer.getUserBySocketId(socket1Id)
        assert.deepEqual(chatUser, chatUser1, 'Should be the same user added to ChatServer')
    }
    


    // Should allow update highscore
    {
        assert.ok(ChatServer.canUpdateHighscore(user1Id, 10000), 'Should allow update highscore')
    }
    

    // Should not allow update highscore
    {
        assert.ok(!ChatServer.canUpdateHighscore(user1Id, 20000), 'Should not allow update highscore')
    }


    // Should remove user from ChatServer by socket id
    {
        ChatServer.removeUserBySocketId(socket1Id)
        assert.deepEqual(ChatServer.users.size, 0, 'Should be no users')    
    }


    // Should remove user from ChatServer by user id
    {
        ChatServer.addUser(chatUser1)
        ChatServer.addUser(chatUser2)
        assert.deepEqual(ChatServer.users.size, 2, 'Should be two users')
        ChatServer.removeUserByUserId(user1Id)
        assert.deepEqual(ChatServer.users.size, 0, 'Should be no users')
    }


    // Prepare instance of ChatServer
    const chatServer1 = new ChatServer()


    // Prepare mocks
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


    // Should not log in to chat server if user is not in db
    {
        await chatServer1.socketLoginServer(mockSocket1, mockData1, mockCalback1)
        assert.deepEqual(ChatServer.users.size, 0, 'Should be no users because user is not in db')
    }


    // Should not log in to chat server when user is in db but not logged in - no token in db
    {
        await db.addUser(dbUser1)
        await chatServer1.socketLoginServer(mockSocket1, mockData1, mockCalback1)
        assert.deepEqual(ChatServer.users.size, 0, 'Should be no users because user is not logged in')    
    }


    // Should log in to chat server when user is in db and is logged in
    {
        await db.addToken(user1Id, token1)
        await chatServer1.socketLoginServer(mockSocket1, mockData1, mockCalback1)
        assert.deepEqual(ChatServer.users.size, 1, 'There should be one user')    
    }

    
    // Should get new username from db
    {
        const dbUser = { ...dbUser1 }
        dbUser.username = 'user2'
        await db.updateUser(dbUser)
        await chatServer1.socketUpdateUsername(mockSocket1)
        assert.deepEqual(ChatServer.users.get(mockSocket1.id).user.username, 'user2', 'Should get new username from db')    
    }


    // Should not update score by more than 11000 points
    {
        chatServer1.socketUpdateScore(mockSocket1, 20000)
        assert.deepEqual(ChatServer.users.get(mockSocket1.id).score, 0, 'Should not update score by more than 11000 points')    
    }


    // Should update score by less than 11000 points
    {
        chatServer1.socketUpdateScore(mockSocket1, 10500)
        assert.deepEqual(ChatServer.users.get(mockSocket1.id).score, 10500, 'Should update score by less than 11000 points')    
    }


    // Should send message to the server
    {
        chatServer1.socketMessageServer(mockSocket1, { text: 'testing' })
        assert.ok(mockIoEmit1, 'Should send message to the server by calling chatServer1.io.emit method')    
    }

        
    // Should log out of the chat
    {
        chatServer1.socketLogoutServer(mockSocket1)
        assert.deepEqual(ChatServer.users.size, 0, 'There should be no users')    
    }


    // Should not send message when user is logged out
    {
        chatServer1.socketMessageServer(mockSocket1, { text: 'testing' })
        assert.ok(mockEmit1, 'Should not send message when user is logged out by calling mockSocket1.emit method')    
    }

}