import assert from 'assert'
import { db } from '../src/db/db.js'

db.connect()

await db.initializeDB()

const user1 = {
    username: 'user1',
    password: '12346',
    email: '',
    highscore: 0
}

// Should add user with unique username
let idUser1
await assert.doesNotReject(async () => idUser1 = await db.addUser(user1), 'Should add user with unique username')
assert.deepEqual(idUser1, 1, 'id Should be 1 for first user in db')

// Should not add user with the same username
await assert.rejects(async () => await db.addUser(user1), 'Should not add user with the same username')

// Should delete existing user
await assert.doesNotReject(async () => idUser1 = await db.deleteUserById(idUser1), 'Should delete existing user')

// Should throw error when delete non-existent user
await assert.rejects(async () => idUser1 = await db.deleteUserById(idUser1), 'Should throw error when delete non-existent user')


db.disconnect()