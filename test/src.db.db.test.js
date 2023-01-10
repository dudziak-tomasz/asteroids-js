import assert from 'assert'
import { test } from 'node:test'
import jwt from 'jsonwebtoken'
import { db } from '../src/db/db.js'
import { config } from '../src/config.js'


// Prepare test data
const user1 = {
    username: 'user1',
    password: '12345',
    email: 'user1@host.com',
    highscore: 0
}
let user1Id, user1Token


// Prepare db
db.connect()
await db.initializeDB()


await test( 'Should add user with unique username', async () => {
    await assert.doesNotReject(async () => user1Id = await db.addUser(user1))
    assert.ok(user1Id > 0, 'Should be a number greater than 0')    
})


await test('Should not add second user with the same username', async () => {
    await assert.rejects(async () => await db.addUser(user1))
})


await test('Should find user by username', async () => {
    const dbUser = await db.findUserByUsername(user1.username)
    assert.deepEqual(dbUser.id, user1Id, 'Should be the same id as when user when addin to db')
    assert.notDeepEqual(dbUser, user1, 'Should not be the same objects because id is missing')
    const userTest = { id: dbUser.id, ...user1}
    assert.deepEqual(dbUser, userTest, 'Should be the same objects')    
})


await test('Should get undefined value for non-existent username', async () => {
    const dbUser = await db.findUserByUsername('testing')
    assert.deepEqual(dbUser, undefined)
})

    
await test('Should find user by email', async () => {
    const dbUser = await db.findUserByEmail(user1.email)
    assert.deepEqual(dbUser.id, user1Id)
    const userTest = { id: dbUser.id, ...user1}
    assert.deepEqual(dbUser, userTest)
})

    
await test('Should not find user by non-existent email', async () => {
    const dbUser = await db.findUserByUsername('testing')
    assert.deepEqual(dbUser, undefined)
})

    
await test('Should find user by id', async () => {
    const dbUser = await db.findUserById(user1Id)
    assert.deepEqual(dbUser.id, user1Id)
    const userTest = { id: dbUser.id, ...user1}
    assert.deepEqual(dbUser, userTest)  
})


await test('Should not find user by non-existent id', async () => {
    const dbUser = await db.findUserById('testing')
    assert.deepEqual(dbUser, undefined)
})


await test('Should update existing user', async () => {
    const userUpdate = { id: user1Id, ...user1}
    userUpdate.username = 'user2'
    const res = await db.updateUser(userUpdate)
    assert.deepEqual(res.changedRows, 1, 'Should update 1 record in db')
    const dbUser = await db.findUserById(user1Id)
    assert.deepEqual(dbUser.username, userUpdate.username)    
})


await test('Should not update non-existent user', async () => {
    const userUpdate = { id: 2, ...user1}
    userUpdate.username = 'testing'
    const res = await db.updateUser(userUpdate)
    assert.deepEqual(res.changedRows, 0, 'Should not update any record in db')    
})


await test('Should not update user without specific id', async () => {
    const userUpdate = { ...user1}
    userUpdate.username = 'testing'
    await assert.rejects(async () => await db.updateUser(userUpdate))    
})
    

await test('Should add token for existing user', async () => {
    user1Token = jwt.sign({ id: user1Id }, config.getItem('tokenKey'))
    await assert.doesNotReject(async () => await db.addToken(user1Id, user1Token))
})


await test('Should find token for existing user', async () => {
    const dbToken = await db.findToken(user1Id, user1Token)
    assert.deepEqual(dbToken.token, user1Token)    
})


await test('Should not find non-exisistent token', async () => {
    const dbToken = await db.findToken(user1Id, 'testing')
    assert.deepEqual(dbToken, undefined)    
})


await test('Should add token for existing user with reason', async () => {
    const reason = 'testing'
    await assert.doesNotReject(async () => await db.addToken(user1Id, user1Token, reason))    
})


await test('Should find existing token with reason', async () => {
    const reason = 'testing'
    const dbToken = await db.findToken(user1Id, user1Token, reason)
    assert.deepEqual(dbToken.reason, reason, 'Should be token with the same reason')    
})


await test('Should not find token by non-exisistent reason', async () => {
    const reason = 'testing2'
    const dbToken = await db.findToken(user1Id, user1Token, reason)
    assert.deepEqual(dbToken, undefined)    
})


await test('Should not delete user who has token in db', async () => {
    await assert.rejects(async () => await db.deleteUserById(user1Id), 'Should reject because of db references')
})


await test('Should delete existing token by id', async () => {
    const dbToken = await db.findToken(user1Id, user1Token)
    await assert.doesNotReject(async () => await db.deleteTokenById(dbToken.id))
    const dbToken2 = await db.findToken(user1Id, user1Token)
    assert.deepEqual(dbToken2, undefined)    
})


await test('Should delete all user tokens by user id', async () => {
    await assert.doesNotReject(async () => await db.deleteTokensByUserId(user1Id))
})


await test('Should delete all user tokens by user id and reason', async () => {
    const reason = 'testing'
    await db.addToken(user1Id, user1Token, reason)
    await db.addToken(user1Id, user1Token, reason)
    await assert.doesNotReject(async () => await db.deleteTokensByUserIdAndReason(user1Id, reason))
    const dbToken = await db.findToken(user1Id, user1Token, reason)
    assert.deepEqual(dbToken, undefined)    
})


await test('Should delete existing user without tokens', async () => {
    await assert.doesNotReject(async () => await db.deleteUserById(user1Id))
})


await test('Should get empty leaderboard', async () => {
    const leaderboard = await db.getLeaderboard()
    assert.deepEqual(leaderboard, [])    
})


await test('Should get leaderboard: top 10 in descending order by highscore', async () => {
    for (let i = 1; i <= 20; i++) await db.addUser({ username: `user${i}`, password: '12345', email: `user${i}@host.com`, highscore: i })

    const leaderboard = await db.getLeaderboard()
    assert.deepEqual(leaderboard.length, 10, 'Should be 10 elements array')
    assert.deepEqual(leaderboard[0].highscore, 20, 'Should be the highest highscore in first element')
    
    const hihgscores = leaderboard.map(leader => leader.highscore)
    assert.deepEqual(hihgscores, [20,19,18,17,16,15,14,13,12,11], 'Should be highscores in descending order')    
})
    

db.disconnect()
