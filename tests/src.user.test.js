import assert from 'assert'
import { User } from '../src/user.js'
import { db } from '../src/db/db.js'

export const userTest = async () => {

    await db.initializeDB()


    // create new user
    const password1 = 'Abc12345'
    const user1 = new User({
        username: 'user1',
        password: password1,
        email: 'user1@host.com'
    })
    assert.deepEqual(user1.username, 'user1', 'Should assign username in the constructor')
    assert.deepEqual(user1.password, password1, 'Should assign password in the constructor')


    // validate username
    assert.ok(user1.validateUsername(), 'Should pass username validation')
    const userNameInvalid1  = new User(user1)
    userNameInvalid1.username = 'aa'
    assert.ok(!userNameInvalid1.validateUsername(), 'Should not pass username validation')
    userNameInvalid1.username = 'aa12345678901234567890'
    assert.ok(!userNameInvalid1.validateUsername(), 'Should not pass username validation')
    userNameInvalid1.username = 'aa$'
    assert.ok(!userNameInvalid1.validateUsername(), 'Should not pass username validation')


    // validate password
    assert.ok(user1.validatePassword(), 'Should pass password validation')
    const userPasswordInvalid1 = new User(user1)
    userPasswordInvalid1.password = '12345'
    assert.ok(!userPasswordInvalid1.validatePassword(), 'Should not pass password validation')
    userPasswordInvalid1.password = userPasswordInvalid1.username + 'Abc123'
    assert.ok(!userPasswordInvalid1.validatePassword(), 'Should not pass password validation')
    delete userPasswordInvalid1.password
    assert.ok(!userPasswordInvalid1.validatePassword(), 'Should not pass password validation')


    // validate email
    assert.ok(user1.validateEmail(), 'Should pass email validation')
    const userEmailInvalid1 = new User(user1)
    delete userEmailInvalid1.email
    assert.ok(userEmailInvalid1.validateEmail(), 'Should pass email validation')
    userEmailInvalid1.email = ''
    assert.ok(userEmailInvalid1.validateEmail(), 'Should pass email validation')
    userEmailInvalid1.email = 'testing@'
    assert.ok(!userEmailInvalid1.validateEmail(), 'Should not pass email validation')


    // hash password
    await assert.doesNotReject(async () => await user1.hashPassword(), 'Should hash password')
    assert.notDeepEqual(user1.password, password1, 'Should be hashed')


    // compare hashed password
    let res = false
    await assert.doesNotReject(async () => res = await user1.comparePassword(password1), 'Should compare passwords')
    assert.ok(res, 'Should match')


    // toJSON should delete password
    const userJSON1 = user1.toJSON()
    assert.ok(!userJSON1.password, 'Should delete password')
    const userJSON2 = JSON.parse(JSON.stringify(user1))
    assert.ok(!userJSON2.password, 'Should delete password automatically when JSON.stringify is used')


    // save user to db as new record
    await assert.doesNotReject(async () => await user1.save(), 'Should add user to db')
    assert.ok(user1.id, 'Should assign new id after adding user to db')    
    const dbUser1 = await db.findUserById(user1.id)
    const user2 = new User(dbUser1)
    assert.deepEqual(user2, user1, 'Should be the same user')


    // update existing user
    user2.username = 'user2'
    await assert.doesNotReject(async () => await user2.save(), 'Should update user')
    const dbUser3 = await db.findUserById(user2.id)
    assert.deepEqual(dbUser3.username, user2.username, 'Should update username')


    // try save user without username
    const user3 = { ...user1 }
    delete (user3.username)
    await assert.rejects(async () => await user3.save(), 'Should not update user')


    // try save user without password
    const user4 = { ...user1 }
    delete (user4.password)
    await assert.rejects(async () => await user4.save(), 'Should not update user')


    // generate token
    await assert.doesNotReject(async () => await user1.generateToken(), 'Should create token and save in db')
    assert.ok(user1.token, 'Should add token to user1')
    const dbToken1 = await db.findToken(user1.id, user1.token)
    assert.deepEqual(user1.token, dbToken1.token, 'Should be the same token in user1 and db')


    // delete all tokens
    await assert.doesNotReject(async () => user1.deleteAllTokens(), 'Should delete all user token from db')
    const dbToken2 = await db.findToken(user1.id, user1.token)
    assert.ok(!dbToken2, 'There should be no token in the database')


    // delete user
    await assert.doesNotReject(async () => await user1.delete(), 'Should delete user from db')
    const dbUser5 = await db.findUserById(user1.id)
    assert.ok(!dbUser5, 'Should not exist in db')

}