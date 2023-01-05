import assert from 'assert'
import request from 'supertest'
import { db } from '../src/db/db.js'
import { app } from '../src/app.js'
import { User } from '../src/user.js'
import { ChatServer } from '../src/chatserver.js'

export const userRouterTest = async () => {

    // Delete data from db
    await db.initializeDB()

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


    // Should create new user
    {
        const res = await request(app).post('/users/new').send(user1).expect(201)
        const dbUser = await db.findUserById(res.body.id)
        assert.ok(dbUser, 'Should be added to db')
        assert.deepEqual(dbUser.username, user1.username, 'Should be the same username')
        assert.deepEqual(dbUser.email, user1.email, 'Should be the same email')
        assert.deepEqual(res.body.password, undefined, 'Password should not be sent')
        const dbToken = await db.findToken(res.body.id, res.body.token)
        assert.deepEqual(dbToken.token, res.body.token, 'Should be logged in and token should be created in db')    
    }


    // Should not create new user with if username taken
    {
        await request(app).post('/users/new')
            .send({
                username: user1.username,
                password: 'Qwerty12345'
            })
            .expect(400)    
    }


    // Should not create new user with if email taken
    {
        await request(app)
            .post('/users/new')
            .send({
                username: 'user2',
                password: 'Qwerty12345',
                email: user1.email
            })
            .expect(400)    
    }


    // Should not create new user with invalid username
    {
        await request(app)
            .post('/users/new')
            .send({
                username: 'aa',
                password: user1.password
            })
            .expect(400)    
    }


    // Should not create new user with invalid password
    {
        await request(app)
            .post('/users/new')
            .send({
                username: 'user2',
                password: '12345'
            })
            .expect(400)    
    }


    // Should not create new user with invalid email
    {
        await request(app)
            .post('/users/new')
            .send({
                username: 'user2',
                password: user1.password,
                email: 'testing@'
            })
            .expect(400)    
    }


    // Should not login non-existent user
    {
        await request(app)
            .post('/users/login')
            .send({
                username: 'user2',
                password: 'Abc12345!'
            })
            .expect(403)    
    }


    // Should not login existing user with incorect password
    {
        await request(app)
            .post('/users/login')
            .send({
                username: user1.username,
                password: 'testing'
            })
            .expect(403)    
    }


    // Should login existing user
    {
        const res = await request(app)
            .post('/users/login')
            .send({
                username: user1.username,
                password: user1.password
            })
            .expect(200)

        const dbToken = await db.findToken(res.body.id, res.body.token)
        assert.deepEqual(dbToken.token, res.body.token, 'Should be created in db')    
    }


    // Prepare user1 for authorization tests
    await login()


    // Should not get profile for unauthorized user
    {
        await request(app)
            .get('/users/me')
            .send()
            .expect(403)
    }


    // Should get profile for authorized user
    {
        const res = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${user1Token}`)
            .send()
            .expect(200)

        assert.deepEqual(res.body.username, user1.username, 'Should be the same username')
        assert.deepEqual(res.body.email, user1.email, 'Should be the same email')
        assert.deepEqual(res.body.password, undefined, 'Password should not be sent')
    }
 

    // Should not logout all sesions unauthorized user
    {
        await request(app)
            .post('/users/logoutall')
            .send()
            .expect(403)
    }


    // Should logout all sesions authorized user
    {
        await request(app)
            .post('/users/logoutall')
            .set('Authorization', `Bearer ${user1Token}`)
            .send()
            .expect(200)
    }


    // Should not get profile for logged out user
    {
        await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${user1Token}`)
            .send()
            .expect(403)
    }


    // Prepare user1 for authorization tests
    await login()


    // Should not logout unauthorized user
    {
        await request(app)
            .post('/users/logout')
            .send()
            .expect(403)
    }


    // Should logout authorized user
    {
        await request(app)
            .post('/users/logout')
            .set('Authorization', `Bearer ${user1Token}`)
            .send()
            .expect(200)
    }


    // Should not send password reset email without email
    {
        await request(app)
            .post('/users/passwordreset')
            .send()
            .expect(400)
    }
    

    // Should not send password reset email by non-existent email
    {
        await request(app)
            .post('/users/passwordreset')
            .send({
                email: 'testing@host.com'
            })
            .expect(403)
    }


    // Should send password reset email by existing email
    {
        await request(app)
            .post('/users/passwordreset')
            .send({
                email: user1.email
            })
            .expect(200)
    }


    // Should not update password without temporary token
    {
        const newPassword = 'Qwe12345'
        await request(app)
            .patch('/users/passwordreset')
            .send({
                password: newPassword
            })
            .expect(403)
    }


    // Should update password with temporary token
    {
        const user1Mock = new User({id: user1Id, ...user1})
        await user1Mock.generateToken('passwordreset')
        const newPassword = 'Qwe12345'
        await request(app).patch('/users/passwordreset')
            .send({
                password: newPassword,
                token: user1Mock.token
            }).expect(200)    
    }


    // Prepare user1 for authorization tests
    user1.password = 'Qwe12345'
    await login()


    // Should not update unauthorized user
    {
        await request(app)
            .patch('/users/me')
            .send({
                username: 'user2'
            })
            .expect(403)
    }
    
    
    // Should update authorized user
    {
        const res = await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                username: 'user2'
            })
            .expect(200)

        const dbUser = await db.findUserById(res.body.id)
        assert.deepEqual(dbUser.username, 'user2', 'Should update username')
    }


    // Should not update highscore
    {
        const res = await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                highscore: 25000
            })
            .expect(200)

        const dbUser = await db.findUserById(res.body.id)
        assert.deepEqual(dbUser.highscore, 0, 'Should not update highscore')
    }


    // Should update highscore if scoreresult was lower than highscore by a maximum of 10000
    {
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
    }


    // Should not delete unauthorized user
    {
        await request(app)
            .delete('/users/me')
            .send()
            .expect(403)
    }


    // Should delete authorized user
    {
        await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${user1Token}`)
            .send()
            .expect(200)

        const dbUser = await db.findUserByUsername('user2')
        assert.ok(!dbUser, 'Should not exist user in db')
    }


    // Should get leaderboard
    {
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
    }

}