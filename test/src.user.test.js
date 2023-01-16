import assert from 'node:assert/strict'
import { test } from 'node:test'
import { User } from '../src/user.js'
import { db } from '../src/db/db.js'


// Prepare test data
const password1 = 'Abc12345'
const user1 = new User({
    username: 'user1',
    password: password1,
    email: 'user1@host.com'
})


test('Should assign user data in the constructor', () => {
    assert.deepEqual(user1.username, 'user1')
    assert.deepEqual(user1.password, password1)    
    assert.deepEqual(user1.email, 'user1@host.com')    
})


test('Should pass username validation', () => {
    assert.deepEqual(user1.validateUsername(), true)
})


test ('Should not pass username validation', () => {
    const userNameInvalid  = new User(user1)
    userNameInvalid.username = 'aa'
    assert.deepEqual(userNameInvalid.validateUsername(), false, 'username to short')
    userNameInvalid.username = 'aa12345678901234567890'
    assert.deepEqual(userNameInvalid.validateUsername(), false, 'username to long')
    userNameInvalid.username = 'aa$'
    assert.deepEqual(userNameInvalid.validateUsername(), false, 'forbidden chars in username')    
})


test('Should pass password validation', () => {
    assert.deepEqual(user1.validatePassword(), true)
})


test('Should not pass password validation', () => {
    const userPasswordInvalid = new User(user1)
    userPasswordInvalid.password = '12345'
    assert.deepEqual(!userPasswordInvalid.validatePassword(), true, 'only numbers in password')
    userPasswordInvalid.password = userPasswordInvalid.username + 'Abc123'
    assert.deepEqual(!userPasswordInvalid.validatePassword(), true, 'password contains username')
    delete userPasswordInvalid.password
    assert.deepEqual(!userPasswordInvalid.validatePassword(), true, 'no password')
})


test('Should pass email validation', () => {
    assert.deepEqual(user1.validateEmail(), true)
    const userEmailInvalid = new User(user1)
    delete userEmailInvalid.email
    assert.deepEqual(userEmailInvalid.validateEmail(), true)
    userEmailInvalid.email = ''
    assert.deepEqual(userEmailInvalid.validateEmail(), true)
})


test('Should not pass email validation', () => {
    const userEmailInvalid = new User(user1)
    userEmailInvalid.email = 'testing@'
    assert.deepEqual(userEmailInvalid.validateEmail(), false)
})


test('Should hash password', async () => {
    await assert.doesNotReject(async () => await user1.hashPassword())
    assert.notDeepEqual(user1.password, password1, 'Should be hashed')    
})


test('Should compare hashed password', async () => {
    let isMatch = false
    await assert.doesNotReject(async () => isMatch = await user1.comparePassword(password1))
    assert.deepEqual(isMatch, true)
})


test('Should delete password when JSON.stringify is used', () => {
    const userJSON1 = user1.toJSON()
    assert.deepEqual(userJSON1.password, undefined, 'Should delete password')
    const userJSON2 = JSON.parse(JSON.stringify(user1))
    assert.deepEqual(userJSON2.password, undefined, 'Should delete password automatically when JSON.stringify is used')
})


// Prepare db
db.connect()
await db.initializeDB()


await test('Should add user to db as new record', async () => {
    await assert.doesNotReject(async () => await user1.save())
    assert.ok(user1.id, 'Should assign new id after adding user to db')    
    const dbUser = await db.findUserById(user1.id)
    const user2 = new User(dbUser)
    assert.deepEqual(user2, user1, 'Should be the same user')
})


await test('Should update existing user', async () => {
    const dbUser = await db.findUserById(user1.id)
    const user2 = new User(dbUser)
    user2.username = 'user2'
    await assert.doesNotReject(async () => await user2.save())
    const dbUser2 = await db.findUserById(user2.id)
    assert.deepEqual(dbUser2.username, user2.username, 'Should update username')    
})


await test('Should not save user without username', async () => {
    const user2 = new User(user1)
    delete (user2.username)
    await assert.rejects(async () => await user2.save())    
})


await test('Should not save user without password', async () => {
    const user2 = new User(user1)
    delete (user2.password)
    await assert.rejects(async () => await user2.save())    
})


await test('Should generate token and save in db', async () => {
    await assert.doesNotReject(async () => await user1.generateToken())
    assert.ok(user1.token, 'Should add token to user1')
    const dbToken = await db.findToken(user1.id, user1.token)
    assert.deepEqual(user1.token, dbToken.token, 'Should be in db')    
})


await test('Should delete all user tokens from db', async () => {
    await assert.doesNotReject(async () => user1.deleteAllTokens())
    const dbToken = await db.findToken(user1.id, user1.token)
    assert.deepEqual(dbToken, undefined, 'Should be no token in db')
})


await test('Should delete user from db', async () => {
    await assert.doesNotReject(async () => await user1.delete())
    const dbUser = await db.findUserById(user1.id)
    assert.deepEqual(dbUser, undefined)
    })


db.disconnect()