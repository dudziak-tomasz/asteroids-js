import assert from 'assert'
import { User } from '../src/user.js'
import { db } from '../src/db/db.js'

export const userTest = async () => {

    // Delete data from db
    await db.initializeDB()

    // Prepare test data
    const password1 = 'Abc12345'
    const user1 = new User({
        username: 'user1',
        password: password1,
        email: 'user1@host.com'
    })

    // Should assign user data in the constructor
    {
        assert.deepEqual(user1.username, 'user1', 'Should assign username in the constructor')
        assert.deepEqual(user1.password, password1, 'Should assign password in the constructor')    
        assert.deepEqual(user1.email, 'user1@host.com', 'Should assign email in the constructor')    
    }


    // Should pass username validation
    {
        assert.ok(user1.validateUsername(), 'Should pass username validation')
    }


    // Should not pass username validation
    {
        const userNameInvalid  = new User(user1)
        userNameInvalid.username = 'aa'
        assert.ok(!userNameInvalid.validateUsername(), 'Should not pass username validation - to short')
        userNameInvalid.username = 'aa12345678901234567890'
        assert.ok(!userNameInvalid.validateUsername(), 'Should not pass username validation - to long')
        userNameInvalid.username = 'aa$'
        assert.ok(!userNameInvalid.validateUsername(), 'Should not pass username validation - forbidden chars')    
    }
    

    // Should pass password validation
    {
        assert.ok(user1.validatePassword(), 'Should pass password validation')
    }

    
    // Should not pass password validation
    {
        const userPasswordInvalid = new User(user1)
        userPasswordInvalid.password = '12345'
        assert.ok(!userPasswordInvalid.validatePassword(), 'Should not pass password validation - only numbers')
        userPasswordInvalid.password = userPasswordInvalid.username + 'Abc123'
        assert.ok(!userPasswordInvalid.validatePassword(), 'Should not pass password validation - contains username')
        delete userPasswordInvalid.password
        assert.ok(!userPasswordInvalid.validatePassword(), 'Should not pass password validation - no password')
    }


    // Should pass email validation
    {
        assert.ok(user1.validateEmail(), 'Should pass email validation')
        const userEmailInvalid = new User(user1)
        delete userEmailInvalid.email
        assert.ok(userEmailInvalid.validateEmail(), 'Should pass email validation')
        userEmailInvalid.email = ''
        assert.ok(userEmailInvalid.validateEmail(), 'Should pass email validation')
    
    }

    // Should not pass email validation
    {
        const userEmailInvalid = new User(user1)
        userEmailInvalid.email = 'testing@'
        assert.ok(!userEmailInvalid.validateEmail(), 'Should not pass email validation')
    }


    // Should hash password
    {
        await assert.doesNotReject(async () => await user1.hashPassword(), 'Should hash password')
        assert.notDeepEqual(user1.password, password1, 'Should be hashed')    
    }


    // Should compare hashed password
    {
        let res = false
        await assert.doesNotReject(async () => res = await user1.comparePassword(password1), 'Should compare hashed passwords')
        assert.ok(res, 'Should match')
    }


    // Should delete password when JSON.stringify is used
    {
        const userJSON1 = user1.toJSON()
        assert.deepEqual(userJSON1.password, undefined, 'Should delete password')
        const userJSON2 = JSON.parse(JSON.stringify(user1))
        assert.deepEqual(userJSON2.password, undefined, 'Should delete password automatically when JSON.stringify is used')
    }


    // Should add user to db as new record
    {
        await assert.doesNotReject(async () => await user1.save(), 'Should add user to db')
        assert.ok(user1.id, 'Should assign new id after adding user to db')    
        const dbUser = await db.findUserById(user1.id)
        const user2 = new User(dbUser)
        assert.deepEqual(user2, user1, 'Should be the same user')
    }



    // Should update existing user
    {
        const dbUser = await db.findUserById(user1.id)
        const user2 = new User(dbUser)
        user2.username = 'user2'
        await assert.doesNotReject(async () => await user2.save(), 'Should update existing user')
        const dbUser2 = await db.findUserById(user2.id)
        assert.deepEqual(dbUser2.username, user2.username, 'Should update username')    
    }


    // Should not save user without username
    {
        const user2 = new User(user1)
        delete (user2.username)
        await assert.rejects(async () => await user2.save(), 'Should not save user without username')    
    }


    // Should not save user without password
    {
        const user2 = new User(user1)
        delete (user2.password)
        await assert.rejects(async () => await user2.save(), 'Should not save user without password')    
    }


    // Should generate token and save in db
    {
        await assert.doesNotReject(async () => await user1.generateToken(), 'Should generate token and save in db')
        assert.ok(user1.token, 'Should add token to user1')
        const dbToken = await db.findToken(user1.id, user1.token)
        assert.deepEqual(user1.token, dbToken.token, 'Should be the same token in user1 and db')    
    }


    // Should delete all user tokens from db
    {
        await assert.doesNotReject(async () => user1.deleteAllTokens(), 'Should delete all user tokens from db')
        const dbToken = await db.findToken(user1.id, user1.token)
        assert.ok(!dbToken, 'Should be no token in the database')    
    }


    // Should delete user from db
    {
        await assert.doesNotReject(async () => await user1.delete(), 'Should delete user from db')
        const dbUser = await db.findUserById(user1.id)
        assert.ok(!dbUser, 'Should not exist in db')    
    }

}