import assert from 'assert'
import request from 'supertest'
import { db } from '../src/db/db.js'
import { app } from '../src/app.js'
import { User } from '../src/user.js'

export const userRouterTest = async () => {

    await db.initializeDB()

    // Prepare data & function
    const user1 = {
        username: 'user1',
        password: 'Abc12345',
        email: 'test@doitjs.eu'
    }
    const login = async () => {
        const res = await request(app).post('/users/login').send(user1)
        user1.id = res.body.id
        user1.token = res.body.token
    }


    // Should create new user
    const res1 = await request(app).post('/users/new').send(user1).expect(201)
    const dbUser1 = await db.findUserById(res1.body.id)
    assert.ok(dbUser1, 'Should be added to db')
    assert.deepEqual(dbUser1.username, user1.username, 'Should be the same username')
    assert.deepEqual(dbUser1.email, user1.email, 'Should be the same email')
    assert.ok(!res1.body.password, 'Password should not be sent')
    const dbToken1 = await db.findToken(res1.body.id, res1.body.token)
    assert.deepEqual(dbToken1.token, res1.body.token, 'Should user be logged in and token should be created in db')


    // Should not create new user with if username taken
    await request(app).post('/users/new').send({
        username: user1.username,
        password: 'Qwerty12345'
    }).expect(400)


    // Should not create new user with if email taken
    await request(app).post('/users/new').send({
        username: 'user2',
        password: 'Qwerty12345',
        email: user1.email
    }).expect(400)


    // Should not create new user with invalid username
    await request(app).post('/users/new').send({
        username: 'aa',
        password: user1.password
    }).expect(400)


    // Should not create new user with invalid password
    await request(app).post('/users/new').send({
        username: 'user2',
        password: '12345'
    }).expect(400)


    // Should not create new user with invalid email
    await request(app).post('/users/new').send({
        username: 'user2',
        password: user1.password,
        email: 'testing@'
    }).expect(400)


    // Should not login non-existent user
    await request(app).post('/users/login').send({
        username: 'user2',
        password: 'Abc12345!'
    }).expect(403)


    // Should not login existing user with incorect password
    await request(app).post('/users/login').send({
        username: user1.username,
        password: 'testing'
    }).expect(403)


    // Should login existing user
    const res2 = await request(app).post('/users/login').send({
        username: user1.username,
        password: user1.password
    }).expect(200)
    const dbToken2 = await db.findToken(res2.body.id, res2.body.token)
    assert.deepEqual(dbToken2.token, res2.body.token, 'Should token be created in db')


    // Prepare user1 for authorization 
    await login()


    // Should not get profile for unauthorized user
    await request(app).get('/users/me').send().expect(403)


    // Should get profile for authorized user
    const res3 = await request(app).get('/users/me')
        .set('Authorization', `Bearer ${user1.token}`)
        .send().expect(200)
    assert.deepEqual(res3.body.username, user1.username, 'Should be the same username')
    assert.deepEqual(res3.body.email, user1.email, 'Should be the same email')
    assert.ok(!res3.body.password, 'Password should not be sent')
 

    // Should not logout all sesions unauthorized user
    await request(app).post('/users/logoutall').send().expect(403)


    // Should logout all sesions authorized user
    await request(app).post('/users/logoutall')
        .set('Authorization', `Bearer ${user1.token}`)
        .send().expect(200)


    // Should not get profile for logged out user
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${user1.token}`)
        .send().expect(403)


    // Prepare user1 for authorization 
    await login()


    // Should not logout unauthorized user
    await request(app).post('/users/logout').send().expect(403)


    // Should logout authorized user
    await request(app).post('/users/logout')
        .set('Authorization', `Bearer ${user1.token}`)
        .send().expect(200)


    // Should not send password reset email without email
    await request(app).post('/users/passwordreset').send().expect(400)


    // Should not send password reset email whith non-existent email
    await request(app).post('/users/passwordreset')
        .send({
            email: 'testing@host.com'
        }).expect(403)


    // Should send password reset email whith existing email
    await request(app).post('/users/passwordreset')
        .send({
            email: user1.email
        }).expect(200)


    // Should not update password without temporary token
    const newPassword1 = 'Qwe12345'
    await request(app).patch('/users/passwordreset')
        .send({
            password: newPassword1
        }).expect(403)


    // Should update password with temporary token
    const mockUser = new User(user1)
    await mockUser.generateToken('passwordreset')
    const newPassword2 = 'Qwe12345'
    await request(app).patch('/users/passwordreset')
        .send({
            password: newPassword2,
            token: mockUser.token
        }).expect(200)


    // Prepare user1 for authorization 
    user1.password = newPassword2
    await login()


    // Should not update unauthorized user
    await request(app).patch('/users/me')
        .send({
            username: 'user2'
        }).expect(403)
    
    
    // Should update authorized user
    const res5 = await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
            username: 'user2'
        }).expect(200)
    const dbUser2 = await db.findUserById(res5.body.id)
    assert.deepEqual(dbUser2.username, 'user2', 'Should update username')

    
    // Should not delete unauthorized user
    await request(app).delete('/users/me').send().expect(403)


    // Should delete authorized user
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${user1.token}`)
        .send().expect(200)
    const dbUser3 = await db.findUserByUsername('user2')
    assert.ok(!dbUser3, 'Should not be user in db')


    // Should get leaderboard
    for (let i = 1; i <= 20; i++) await db.addUser({ username: `user${i}`, password: '12345', email: `user${i}@host.com`, highscore: i })
    const res6 = await request(app).get('/leaderboard').expect(200)
    const leaderboard1 = res6.body
    assert.deepEqual(leaderboard1.length, 10, 'Should be 10 elements array')
    assert.deepEqual(leaderboard1[0].highscore, 20, 'Should be the highest highscore in first element')
    const hihgscores1 = leaderboard1.map(leader => leader.highscore)
    assert.deepEqual(hihgscores1, [20,19,18,17,16,15,14,13,12,11], 'Should be highscores in descending order')

}