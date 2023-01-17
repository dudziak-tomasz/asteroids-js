import assert from 'node:assert/strict'
import { test } from 'node:test'
import { db } from '../src/db/db.js'
import { config } from '../public/js/config.js'
import { User } from '../src/user.js'

import './__mocks__/mock.dom.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'


// Prepare db
db.connect()
await db.initializeDB()


await test('Should fetch data from REST endpoints', async (t) => {

    // Prepare mocks
    global.dom.reconfigure({ url: 'http://localhost' })
    api.prefix = config.getItem('apiPrefix')
    game.mainDiv = global.document.body

    // Check connection to the correct API server
    const leaderboard = await api.getLeaderboard()
    if (!leaderboard || leaderboard.length > 0) assert.fail('========== API SERVER SHOULD BE STARTED WITH "--test" ARGUMENT ==========')

    // Prepare test data & function
    const user1 = {
        username: 'user1',
        password: 'Abc12345',
        email: 'test@doitjs.eu'
    }

    await t.test('Should assign defauld data', () => {
        assert.deepEqual(api.user, undefined)
        assert.deepEqual(api.parseError, { status: 499 })
        assert.deepEqual(api.prefix, 'http://127.0.0.1:3000')    
    })


    await t.test('Should save token in localStorage', () => {
       api.setToken('testing')
       const token = localStorage.getItem('token')
       assert.deepEqual(token, 'testing')
    })


    await t.test('Should get token from localStorage', () => {
        api.setToken('testing')
        const token = api.getToken()
        assert.deepEqual(token, 'testing')
    })


    await t.test('Should remove token from localStorage', () => {
        api.removeToken()
        const token = api.getToken()
        assert.deepEqual(token, undefined)
    })


    await t.test('Should get empty leaderboard', async () => {
        const leaderboard = await api.getLeaderboard()
        assert.deepEqual(leaderboard, [])
    })


    await t.test('Should create and login new user', async () => {
        const res = await api.newUser(user1)
        assert.deepEqual(res.status, 201)
        assert.deepEqual(api.user.username, user1.username)
        assert.deepEqual(api.user.email, user1.email)
        assert.ok(api.user.id)

        const dbUser = await db.findUserById(api.user.id)
        assert.deepEqual(dbUser.username, user1.username)
        assert.deepEqual(dbUser.email, user1.email)

        const token = api.getToken()
        assert.ok(token)

        const dbToken = await db.findToken(api.user.id, token)
        assert.deepEqual(dbToken.token, token)
    })


    await t.test('Should not create new user if username taken', async () => {
        const res = await api.newUser(user1)
        assert.deepEqual(res.status, 400)
        assert.deepEqual(res.error, 'username taken')
    })


    await t.test('Should not create new user if email taken', async () => {
        const user2 = {...user1}
        user2.username = 'user2'

        const res = await api.newUser(user2)
        assert.deepEqual(res.status, 400)
        assert.deepEqual(res.error, 'email taken')
    })


    await t.test('Should not create new user with invalid username', async () => {
        const user2 = {...user1}
        user2.username = 'aa'

        const res = await api.newUser(user2)
        assert.deepEqual(res.status, 400)
        assert.deepEqual(res.error, 'username is invalid')
    })


    await t.test('Should not create new user with invalid password', async () => {
        const user2 = {
            username: 'user2',
            password: '12345'
        }

        const res = await api.newUser(user2)
        assert.deepEqual(res.status, 400)
        assert.deepEqual(res.error, 'password too weak')
    })


    await t.test('Should not create new user with invalid email', async () => {
        const user2 = {
            username: 'user2',
            password: user1.password,
            email: 'testing@'
        }

        const res = await api.newUser(user2)
        assert.deepEqual(res.status, 400)
        assert.deepEqual(res.error, 'email is invalid')
    })


    await t.test('Should get user profile', async () => {
        api.user = undefined

        const res = await api.profile()
        assert.deepEqual(res.status, 200)
        assert.deepEqual(api.user.username, user1.username)
        assert.deepEqual(api.user.email, user1.email)
        assert.ok(api.user.id)
    })


    await t.test('Should logout authorized user', async () => {
        const user1Id = api.user.id
        const token = api.getToken()

        const res = await api.logout()
        assert.deepEqual(res.status, 200)
        assert.deepEqual(api.user, undefined)

        const dbToken = await db.findToken(user1Id, token)
        assert.deepEqual(dbToken, undefined)
    })


    await t.test('Should not logout unauthorized user', async () => {
        const res = await api.logout()
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should not logout all sesions unauthorized user', async () => {
        const res = await api.logoutAll()
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should not get profile for unauthorized user', async () => {
        const res = await api.profile()
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should not update unauthorized user', async () => {
        const user2 = {...user1}
        user2.username = 'user2'
        const res = await api.updateUser(user2)
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should not delete unauthorized user', async () => {
        const res = await api.deleteUser()
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should not login non-existent user', async () => {
        const user2 = {
            username: 'user2',
            password: user1.password
        }
        const res = await api.login(user2)
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should not login with incorrect password', async () => {
        const user2 = {... user1}
        user2.password = 'AbC!!!111'
        
        const res = await api.login(user2)
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should check username and password but should not login', async () => {
        const user2 = {... user1, checkPasswordOnly: true}
        
        const res = await api.login(user2)
        assert.deepEqual(res.status, 200)
        assert.deepEqual(api.user, undefined)
        assert.deepEqual(api.getToken(), undefined)
    })


    await t.test('Should login existing user', async () => {
        const res = await api.login(user1)
        assert.deepEqual(res.status, 200)

        assert.deepEqual(api.user.username, user1.username)
        assert.deepEqual(api.user.email, user1.email)
        assert.ok(api.user.id)

        const token = api.getToken()
        assert.ok(token)

        const dbToken = await db.findToken(api.user.id, token)
        assert.deepEqual(dbToken.token, token)
    })


    await t.test('Should update unauthorized user', async () => {
        const res = await api.updateUser({ username: 'user2' })
        assert.deepEqual(res.status, 200)

        const dbUser = await db.findUserById(api.user.id)
        assert.deepEqual(dbUser.username, 'user2')
    })


    await t.test('Should not update highscore', async () => {
        const res = await api.updateUser({ highscore: 25000 })
        assert.deepEqual(res.status, 400)
    
        const dbUser = await db.findUserById(api.user.id)
        assert.deepEqual(dbUser.highscore, 0)
    })
    

    await t.test('Should not send password reset email without email', async () => {
        const res = await api.passwordReset()
        assert.deepEqual(res.status, 400)
    })
    
    
    await t.test('Should not send password reset email by non-existent email', async () => {
        const res = await api.passwordReset({ email: 'testing@host.com' })
        assert.deepEqual(res.status, 403)
    })
    
    
    await t.test('Should send password reset email by existing email', async () => {
        const res = await api.passwordReset({ email: user1.email })
        assert.deepEqual(res.status, 200)
    })


    await t.test('Should not update password without temporary token', async () => {
        const newPassword = 'Qwe12345'
        const res = await api.passwordUpdate({ password: newPassword })
        assert.deepEqual(res.status, 403)
    })


    await t.test('Should update password with temporary token', async () => {
        const user1Mock = new User({id: api.user.id, ...user1})
        await user1Mock.generateToken('passwordreset')
        const newPassword = 'Qwe12345'

        const res = await api.passwordUpdate({ 
            password: newPassword, 
            token: user1Mock.token
        })

        assert.deepEqual(res.status, 200)
    })


    await t.test('Should delete user', async () => {
        const res = await api.deleteUser()
        assert.deepEqual(res.status, 200)
    })


    await t.test('Should get leaderboard', async () => {
        for (let i = 1; i <= 20; i++) await db.addUser({ username: `user${i}`, password: '12345', email: `user${i}@host.com`, highscore: i })
    
        const leaderboard = await api.getLeaderboard()
    
        assert.deepEqual(leaderboard.length, 10, 'Should be 10 elements array')
        assert.deepEqual(leaderboard[0].highscore, 20, 'Should be the highest highscore in first element')
    
        const hihgscores = leaderboard.map(leader => leader.highscore)
        assert.deepEqual(hihgscores, [20,19,18,17,16,15,14,13,12,11], 'Should be highscores in descending order')    
    })

})

db.disconnect()