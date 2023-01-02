import assert from 'assert'
import jwt from 'jsonwebtoken'
import { db } from '../src/db/db.js'
import { config } from '../src/config.js'

export const dbTest = async () => {

    await db.initializeDB()

    const user1 = {
        username: 'user1',
        password: '12345',
        email: 'user1@host.com',
        highscore: 0
    }
    
    let idUser1
    
    // add first user to db
    await assert.doesNotReject(async () => idUser1 = await db.addUser(user1), 'Should add user with unique username')
    
    
    // check id of created user
    assert.deepEqual(idUser1, 1, 'id Should be 1 for first user in db')
    
    
    // try add user with the same name
    await assert.rejects(async () => await db.addUser(user1), 'Should not add user with the same username')
    
    
    // find user by username
    const dbUser1 = await db.findUserByUsername(user1.username)
    assert.deepEqual(dbUser1.id, idUser1, 'Should be the same id as when user when addin to db')
    assert.notDeepEqual(dbUser1, user1, 'Should not be the same objects because id is missing')
    const user1Test = { id: dbUser1.id, ...user1}
    assert.deepEqual(dbUser1, user1Test, 'Should be the same objects')
    
    
    // try find user by non-existent username
    const dbUser2 = await db.findUserByUsername('testing')
    assert.deepEqual(dbUser2, undefined, 'Should get undefined value for non-existent username')
    
    
    // find user by email
    const dbUser3 = await db.findUserByEmail(user1.email)
    assert.deepEqual(dbUser3.id, idUser1, 'Should be the same id as when user when addin to db')
    const user3Test = { id: dbUser3.id, ...user1}
    assert.deepEqual(dbUser3, user3Test, 'Should be the same objects')
    
    
    // try find user by non-existent email
    const dbUser4 = await db.findUserByUsername('testing')
    assert.deepEqual(dbUser4, undefined, 'Should get undefined value for non-existent email')
    
    
    // find user by id
    const dbUser5 = await db.findUserById(idUser1)
    assert.deepEqual(dbUser5.id, idUser1, 'Should be the same id as when user when addin to db')
    const user5Test = { id: dbUser5.id, ...user1}
    assert.deepEqual(dbUser5, user5Test, 'Should be the same objects')
    
    
    // try find user by non-existent id
    const dbUser6 = await db.findUserByUsername('testing')
    assert.deepEqual(dbUser6, undefined, 'Should get undefined value for non-existent email')
    
    
    // update user
    const userUpdate1 = { id: idUser1, ...user1}
    userUpdate1.username = 'user2'
    const res1 = await db.updateUser(userUpdate1)
    assert.deepEqual(res1.changedRows, 1, 'Should update 1 record in db')
    const dbUser7 = await db.findUserById(idUser1)
    assert.deepEqual(dbUser7.username, userUpdate1.username, 'Should change username in db')
    
    
    // try update user by non-existent id
    const userUpdate2 = { id: 2, ...user1}
    userUpdate2.username = 'testing'
    const res2 = await db.updateUser(userUpdate2)
    assert.deepEqual(res2.changedRows, 0, 'Should not update any record in db')
    
    
    // try update user without specifying id
    const userUpdate3 = { ...user1}
    userUpdate3.username = 'testing'
    await assert.rejects(async () => await db.updateUser(userUpdate3), 'Should reject when update without id')
    
    
    // prepare token for user1
    const token1 = jwt.sign({ id: idUser1 }, config.getItem('tokenKey'))
    
    
    // add token for user1
    await assert.doesNotReject(async () => await db.addToken(idUser1, token1), 'Should add token for existing user')
    
    
    // find token
    const dbToken1 = await db.findToken(idUser1, token1)
    assert.deepEqual(dbToken1.token, token1, 'Should be the same token')
    
    
    // try find non-exisistent token
    const dbToken2 = await db.findToken(idUser1, 'testing')
    assert.deepEqual(dbToken2, undefined, 'Should get undefined value for non-existent token')
    
    
    // add token for user1 with reason
    const reason1 = 'testing'
    await assert.doesNotReject(async () => await db.addToken(idUser1, token1, reason1), 'Should add token for existing user')
    
    
    // find token with reason
    const dbToken3 = await db.findToken(idUser1, token1, reason1)
    assert.deepEqual(dbToken3.reason, reason1, 'Should be token with the same reason')
    
    
    // try find token with non-exisistent reason
    const dbToken4 = await db.findToken(idUser1, 'testing2')
    assert.deepEqual(dbToken4, undefined, 'Should get undefined value for non-existent reason')
    
    
    // try delete user who has token in db
    await assert.rejects(async () => await db.deleteUserById(idUser1), 'Should reject because of db references')
    
    
    // delete token by id
    await assert.doesNotReject(async () => await db.deleteTokenById(dbToken1.id), 'Should delete existing token')
    const dbToken5 = await db.findToken(idUser1, token1)
    assert.deepEqual(dbToken5, undefined, 'Should get undefined value for non-existent token')
    
    
    // delete all user tokens by user id
    await assert.doesNotReject(async () => await db.deleteTokensByUserId(idUser1), 'Should delete all existing tokens')
    
    
    // delete all user tokens by user id and reason
    const reason2 = 'testing2'
    await db.addToken(idUser1, token1, reason2)
    await db.addToken(idUser1, token1, reason2)
    await assert.doesNotReject(async () => await db.deleteTokensByUserIdAndReason(idUser1, reason2), 'Should delete all existing tokens')
    const dbToken6 = await db.findToken(idUser1, token1, reason2)
    assert.deepEqual(dbToken6, undefined, 'Should get undefined value for non-existent token')
    
    
    // delete user by id without tokens
    await assert.doesNotReject(async () => await db.deleteUserById(idUser1), 'Should delete existing user')
    
    
    // get empty leaderboard
    const leaderboard1 = await db.getLeaderboard()
    assert.deepEqual(leaderboard1, [], 'Should be empty array')
    
    
    // get leaderboard
    for (let i = 1; i <= 20; i++) await db.addUser({ username: `user${i}`, password: '12345', email: `user${i}@host.com`, highscore: i })
    const leaderboard2 = await db.getLeaderboard()
    assert.deepEqual(leaderboard2.length, 10, 'Should be 10 elements array')
    assert.deepEqual(leaderboard2[0].highscore, 20, 'Should be the highest highscore in first element')
    const hihgscores = leaderboard2.map(leader => leader.highscore)
    assert.deepEqual(hihgscores, [20,19,18,17,16,15,14,13,12,11], 'Should be highscores in descending order')
    
}

