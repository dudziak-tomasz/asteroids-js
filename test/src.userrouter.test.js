import assert from 'node:assert/strict'
import { test } from 'node:test'
import request from 'supertest'
import { db } from '../src/db/db.js'
import { app } from '../src/app.js'
import { User } from '../src/user.js'
import { ChatServer } from '../src/chatserver.js'


// Prepare test data & function
const user1 = {
    username: 'user1',
    password: 'Abc12345',
    email: 'test@doitjs.eu'
}

let user1Id, user1Token

const login = async () => {
    const res = await request(app).post('/users/login').send(user1)
    user1Id = res.body.id
    user1Token = res.body.token
}


// Prepare db
db.connect()
await db.initializeDB()


await test('Should create new user', async () => {
    const res = await request(app).post('/users/new').send(user1).expect(201)
    const dbUser = await db.findUserById(res.body.id)
    assert.ok(dbUser, 'Should be added to db')
    assert.deepEqual(dbUser.username, user1.username, 'Should be the same username')
    assert.deepEqual(dbUser.email, user1.email, 'Should be the same email')
    assert.deepEqual(res.body.password, undefined, 'Password should not be sent via API')
    const dbToken = await db.findToken(res.body.id, res.body.token)
    assert.deepEqual(dbToken.token, res.body.token, 'Should be created in db')    
})


await test('Should not create new user with if username taken', async () => {
    await request(app).post('/users/new')
        .send({
            username: user1.username,
            password: 'Qwerty12345'
        })
        .expect(400)    
})


await test('Should not create new user with if email taken', async () => {
    await request(app)
        .post('/users/new')
        .send({
            username: 'user2',
            password: 'Qwerty12345',
            email: user1.email
        })
        .expect(400)    
})


await test('Should not create new user with invalid username', async () => {
    await request(app)
        .post('/users/new')
        .send({
            username: 'aa',
            password: user1.password
        })
        .expect(400)
})


await test('Should not create new user with invalid password', async () => {
    await request(app)
        .post('/users/new')
        .send({
            username: 'user2',
            password: '12345'
        })
        .expect(400)
})


await test('Should not create new user with invalid email', async () => {
    await request(app)
        .post('/users/new')
        .send({
            username: 'user2',
            password: user1.password,
            email: 'testing@'
        })
        .expect(400)    
})


await test('Should not login non-existent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            username: 'user2',
            password: 'Abc12345!'
        })
        .expect(403)    
})


await test('Should not login existing user with incorect password', async () => {
    await request(app)
        .post('/users/login')
        .send({
            username: user1.username,
            password: 'testing'
        })
        .expect(403)    
})


await test('Should check username and password but should not login', async () => {
    const res = await request(app)
        .post('/users/login')
        .send({
            username: user1.username,
            password: user1.password,
            checkPasswordOnly: true
        })
        .expect(200)

    assert.deepEqual(res.body.token, undefined, 'Should not send back token')  
})


await test('Should login existing user', async () => {
    const res = await request(app)
        .post('/users/login')
        .send({
            username: user1.username,
            password: user1.password
        })
        .expect(200)

    const dbToken = await db.findToken(res.body.id, res.body.token)
    assert.deepEqual(dbToken.token, res.body.token, 'Should be created in db')    
})


// Prepare user1 for authorization tests
await login()


await test('Should not get profile for unauthorized user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(403)
})


await test('Should get profile for authorized user', async () => {
    const res = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send()
        .expect(200)

    assert.deepEqual(res.body.username, user1.username, 'Should be the same username')
    assert.deepEqual(res.body.email, user1.email, 'Should be the same email')
    assert.deepEqual(res.body.password, undefined, 'Password should not be sent')
})


await test('Should not logout all sesions unauthorized user', async () => {
    await request(app)
        .post('/users/logoutall')
        .send()
        .expect(403)
})


await test('Should logout all sesions authorized user', async () => {
    await request(app)
        .post('/users/logoutall')
        .set('Authorization', `Bearer ${user1Token}`)
        .send()
        .expect(200)
})


await test('Should not get profile for logged out user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send()
        .expect(403)
})


// Prepare user1 for authorization tests
await login()


await test('Should not logout unauthorized user', async () => {
    await request(app)
        .post('/users/logout')
        .send()
        .expect(403)
})


await test('Should logout authorized user', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${user1Token}`)
        .send()
        .expect(200)
})


await test('Should not send password reset email without email', async () => {
    await request(app)
        .post('/users/passwordreset')
        .send()
        .expect(400)
})


await test('Should not send password reset email by non-existent email', async () => {
    await request(app)
        .post('/users/passwordreset')
        .send({
            email: 'testing@host.com'
        })
        .expect(403)
})


await test('Should send password reset email by existing email', async () => {
    await request(app)
        .post('/users/passwordreset')
        .send({
            email: user1.email
        })
        .expect(200)
})


await test('Should not update password without temporary token', async () => {
    const newPassword = 'Qwe12345'
    await request(app)
        .patch('/users/passwordreset')
        .send({
            password: newPassword
        })
        .expect(403)
})


await test('Should update password with temporary token', async () => {
    const user1Mock = new User({id: user1Id, ...user1})
    await user1Mock.generateToken('passwordreset')
    const newPassword = 'Qwe12345'
    await request(app).patch('/users/passwordreset')
        .send({
            password: newPassword,
            token: user1Mock.token
        }).expect(200)    
})


// Prepare user1 for authorization tests
user1.password = 'Qwe12345'
await login()


await test('Should not update unauthorized user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            username: 'user2'
        })
        .expect(403)
})


await test('Should update authorized user', async () => {
    const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
            username: 'user2'
        })
        .expect(200)

    const dbUser = await db.findUserById(res.body.id)
    assert.deepEqual(dbUser.username, 'user2', 'Should update username')
})


await test('Should not update highscore', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
            highscore: 25000
        })
        .expect(400)

    const dbUser = await db.findUserById(user1Id)
    assert.deepEqual(dbUser.highscore, 0)
})


await test('Should update highscore if score was lower than highscore by maximum of 10000', async () => {
    // Prepare mocks
    const chatUser = {
        user: {
            id: user1Id,
            ...user1
        },
        score: 20030
    }
    ChatServer.addUser(chatUser)
    
    const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
            highscore: 25000
        })
        .expect(200)

    const dbUser = await db.findUserById(res.body.id)
    assert.deepEqual(dbUser.highscore, 25000, 'Should update highscore')
})


await test('Should not delete unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(403)
})


await test('Should delete authorized user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send()
        .expect(200)

    const dbUser = await db.findUserByUsername('user2')
    assert.deepEqual(dbUser, undefined)
})


await test('Should get leaderboard', async () => {
    for (let i = 1; i <= 20; i++) await db.addUser({ username: `user${i}`, password: '12345', email: `user${i}@host.com`, highscore: i })

    const res = await request(app)
        .get('/leaderboard')
        .send()
        .expect(200)

    const leaderboard = res.body
    assert.deepEqual(leaderboard.length, 10, 'Should be 10 elements array')
    assert.deepEqual(leaderboard[0].highscore, 20, 'Should be the highest highscore in first element')

    const hihgscores = leaderboard.map(leader => leader.highscore)
    assert.deepEqual(hihgscores, [20,19,18,17,16,15,14,13,12,11], 'Should be highscores in descending order')    
})


db.disconnect()