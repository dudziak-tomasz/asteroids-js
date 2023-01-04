import assert from 'assert'
import jwt from 'jsonwebtoken'
import { db } from '../src/db/db.js'
import { config } from '../src/config.js'

export const dbTest = async () => {

    // Delete data from db
    await db.initializeDB()

    // Prepare test data
    const user1 = {
        username: 'user1',
        password: '12345',
        email: 'user1@host.com',
        highscore: 0
    }
    let user1Id, user1Token
    

    // Should add user to db with unique username and get user1Id
    {
        await assert.doesNotReject(async () => user1Id = await db.addUser(user1), 'Should add user with unique username')
        assert.deepEqual(user1Id, 1, 'id Should be 1 for first user in db')    
    }
    
    
    // Should not add second user with the same username
    {
        await assert.rejects(async () => await db.addUser(user1), 'Should not add second user with the same username')
    }
    
    
    // Should find user by username
    {
        const dbUser = await db.findUserByUsername(user1.username)
        assert.deepEqual(dbUser.id, user1Id, 'Should be the same id as when user when addin to db')
        assert.notDeepEqual(dbUser, user1, 'Should not be the same objects because id is missing')
        const userTest = { id: dbUser.id, ...user1}
        assert.deepEqual(dbUser, userTest, 'Should be the same objects')    
    }
    
    
    // Should get undefined value for non-existent username
    {
        const dbUser = await db.findUserByUsername('testing')
        assert.deepEqual(dbUser, undefined, 'Should get undefined value for non-existent username')
    }
    
       
    // Should find user by email
    {
        const dbUser = await db.findUserByEmail(user1.email)
        assert.deepEqual(dbUser.id, user1Id, 'Should be the same id')
        const userTest = { id: dbUser.id, ...user1}
        assert.deepEqual(dbUser, userTest, 'Should be the same objects')
    }
    
      
    // Should not find user by non-existent email
    {
        const dbUser = await db.findUserByUsername('testing')
        assert.deepEqual(dbUser, undefined, 'Should get undefined value for non-existent email')
    }

      
    // Should find user by id
    {
        const dbUser = await db.findUserById(user1Id)
        assert.deepEqual(dbUser.id, user1Id, 'Should be the same id as user1')
        const userTest = { id: dbUser.id, ...user1}
        assert.deepEqual(dbUser, userTest, 'Should be the same objects')  
    }
    
    
    // Should not find user by non-existent id
    {
        const dbUser = await db.findUserById('testing')
        assert.deepEqual(dbUser, undefined, 'Should get undefined value for non-existent id')
    }

    
    // Should update existing user
    {
        const userUpdate = { id: user1Id, ...user1}
        userUpdate.username = 'user2'
        const res = await db.updateUser(userUpdate)
        assert.deepEqual(res.changedRows, 1, 'Should update 1 record in db')
        const dbUser = await db.findUserById(user1Id)
        assert.deepEqual(dbUser.username, userUpdate.username, 'Should change username in db')    
    }
    
    
    // Should not update non-existent user
    {
        const userUpdate = { id: 2, ...user1}
        userUpdate.username = 'testing'
        const res = await db.updateUser(userUpdate)
        assert.deepEqual(res.changedRows, 0, 'Should not update any record in db')    
    }
    
    
    // Should not update user without specific id
    {
        const userUpdate = { ...user1}
        userUpdate.username = 'testing'
        await assert.rejects(async () => await db.updateUser(userUpdate), 'Should reject when update without id')    
    }
    
    
    // Prepare token for user1
    user1Token = jwt.sign({ id: user1Id }, config.getItem('tokenKey'))
    
    
    // Should add token for existing user
    {
        await assert.doesNotReject(async () => await db.addToken(user1Id, user1Token), 'Should add token for existing user')
    }
    
    
    // Should find token for existing user
    {
        const dbToken = await db.findToken(user1Id, user1Token)
        assert.deepEqual(dbToken.token, user1Token, 'Should be the same token')    
    }
    
    
    // Should not find non-exisistent token
    {
        const dbToken = await db.findToken(user1Id, 'testing')
        assert.deepEqual(dbToken, undefined, 'Should get undefined value for non-existent token')    
    }
    
    
    // Should add token for existing user with reason
    {
        const reason = 'testing'
        await assert.doesNotReject(async () => await db.addToken(user1Id, user1Token, reason), 'Should add token for existing user with reason')    
    }
    
    
    // Should find existing token with reason
    {
        const reason = 'testing'
        const dbToken = await db.findToken(user1Id, user1Token, reason)
        assert.deepEqual(dbToken.reason, reason, 'Should be token with the same reason')    
    }
    
    
    // Should not find token by non-exisistent reason
    {
        const reason = 'testing2'
        const dbToken = await db.findToken(user1Id, user1Token, reason)
        assert.deepEqual(dbToken, undefined, 'Should get undefined value for non-existent reason')    
    }
    
    
    // Should not delete user who has token in db
    {
        await assert.rejects(async () => await db.deleteUserById(user1Id), 'Should reject because of db references')
    }
    
    
    // Should delete existing token by id
    {
        const dbToken = await db.findToken(user1Id, user1Token)
        await assert.doesNotReject(async () => await db.deleteTokenById(dbToken.id), 'Should delete existing token')
        const dbToken2 = await db.findToken(user1Id, user1Token)
        assert.deepEqual(dbToken2, undefined, 'Should get undefined value for non-existent token')    
    }
    
    
    // Should delete all user tokens by user id
    {
        await assert.doesNotReject(async () => await db.deleteTokensByUserId(user1Id), 'Should delete all existing tokens by user id')
    }
    
    
    // Should delete all user tokens by user id and reason
    {
        const reason = 'testing'
        await db.addToken(user1Id, user1Token, reason)
        await db.addToken(user1Id, user1Token, reason)
        await assert.doesNotReject(async () => await db.deleteTokensByUserIdAndReason(user1Id, reason), 'Should delete all existing tokens with reason')
        const dbToken = await db.findToken(user1Id, user1Token, reason)
        assert.deepEqual(dbToken, undefined, 'Should get undefined value for non-existent token')    
    }
    
    
    // Should delete existing user by id without tokens
    {
        await assert.doesNotReject(async () => await db.deleteUserById(user1Id), 'Should delete existing user without tokens')
    }
    
    
    // Should get empty leaderboard
    {
        const leaderboard = await db.getLeaderboard()
        assert.deepEqual(leaderboard, [], 'Should get empty array')    
    }
    
    
    // Should get leaderboard: top 10 in descending order by highscore
    {
        for (let i = 1; i <= 20; i++) await db.addUser({ username: `user${i}`, password: '12345', email: `user${i}@host.com`, highscore: i })

        const leaderboard = await db.getLeaderboard()
        assert.deepEqual(leaderboard.length, 10, 'Should be 10 elements array')
        assert.deepEqual(leaderboard[0].highscore, 20, 'Should be the highest highscore in first element')
        
        const hihgscores = leaderboard.map(leader => leader.highscore)
        assert.deepEqual(hihgscores, [20,19,18,17,16,15,14,13,12,11], 'Should be highscores in descending order')    
    }
    
}

