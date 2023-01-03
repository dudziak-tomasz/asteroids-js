import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { config } from './config.js'
import { db } from './db/db.js'
import { ChatServer } from './chatserver.js'

export class User {
    constructor(user = {}) {

        this.id = undefined
        this.username = undefined
        this.password = undefined
        this.email = undefined
        this.highscore = undefined
        this.token = undefined

        if (typeof user.id === 'number') this.id = user.id
        if (typeof user.username === 'string') this.username = user.username.trim().toLowerCase()
        if (typeof user.password === 'string') this.password = user.password.trim()
        if (typeof user.email === 'string') this.email = user.email.trim().toLowerCase()
        if (typeof user.highscore === 'number') this.highscore = user.highscore
        if (typeof user.token === 'string') this.token = user.token
    }

    async save() {

        if (!this.username || !this.password) throw new Error()
        if (this.email === undefined) this.email = ''
        if (this.highscore === undefined) this.highscore = 0

        if (this.id === undefined) this.id = await db.addUser(this)
        else await db.updateUser(this)
    }

    async delete() {

        await this.deleteAllTokens()
        await db.deleteUserById(this.id)

    }

    async deleteAllTokens() {

        await db.deleteTokensByUserId(this.id)
        ChatServer.removeUserByUserId(this.id)

    }

    async hashPassword() {

        this.password = await bcrypt.hash(this.password, 8)

    }

    async comparePassword(password) {

        return await bcrypt.compare(password, this.password)

    }

    toJSON() {

        const user = new User(this)
        delete user.password

        return user

    }

    validateUsername() {

        if (!this.username) return false
        if (this.username.length < 3 || this.username.length > 20) return false
        if (!validator.isAlphanumeric(this.username.replaceAll('_', ''))) return false

        return true
    }

    validatePassword() {

        if (!this.password) return false
        if (this.password.toLowerCase().includes(this.username)) return false
        if (!validator.isStrongPassword(this.password,{ minSymbols: 0 })) return false

        return true
    }

    validateEmail() {

        if (this.email === undefined || this.email === '') return true
        if (!validator.isEmail(this.email)) return false

        return true

    }

    async generateToken(reason = '') {

        const token = jwt.sign({ id: this.id }, config.getItem('tokenKey'))
        await db.addToken(this.id, token, reason)
        this.token = token

        return token
    }

}