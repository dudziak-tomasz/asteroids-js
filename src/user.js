import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { config } from './config.js'
import { db } from './db/db.js'

export class User {
    constructor(user = {}) {

        this.id = undefined
        this.username = undefined
        this.password = undefined
        this.email = undefined
        this.highscore = undefined

        if (typeof user.id === 'number') this.id = user.id
        if (typeof user.username === 'string') this.username = user.username.trim().toLowerCase()
        if (typeof user.password === 'string') this.password = user.password.trim()
        if (typeof user.email === 'string') this.email = user.email.trim()
        if (typeof user.highscore === 'number') this.highscore = user.highscore
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
        if (this.username.length < 3) return false
        if (this.username.length > 20) return false
        if (!validator.isAlphanumeric(this.username)) return false

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

    async generateToken() {

        const token = jwt.sign({ id: this.id }, config.getItem('tokenKey'))
        await db.addToken(this.id, token)

        return token
    }

    static async authorization (req, res, next) {

        const token = req.cookies.access_token

        if (!token) return res.status(403).send()

        try {
            const data = jwt.verify(token, config.getItem('tokenKey'))

            const user = await db.findUserById(data.id)
            if (!user) throw new Error()
    
            const dbToken = await db.findToken(user.id, token)
            if (!dbToken) throw new Error()
    
            req.user = new User(user)
            req.token = dbToken
    
            return next()
        } catch {
            return res.status(403).send()
        }
    
    }

    static async apiNewUser(req, res) {

        try {
            const newUser = new User(req.body)

            const dbUser = await db.findUserByUsername(newUser.username)
    
            if (dbUser) return res.status(400).send({ error: 'username taken' })

            if (!newUser.validateUsername()) return res.status(400).send({ error: 'username is invalid' })
            if (!newUser.validatePassword()) return res.status(400).send({ error: 'password too weak' })
            if (!newUser.validateEmail()) return res.status(400).send({ error: 'email is invalid' })

            await newUser.hashPassword()

            // Todo: highscore only by update endpoint
            newUser.highscore = 0

            await newUser.save()

            const token = await newUser.generateToken()
    
            return res
                    .cookie('access_token', token, {
                        httpOnly: true,
                        secure: config.getItem('https')
                    })
                    .status(201)
                    .send(newUser)
                
        } catch {
            return res.status(500).send()
        }

    }

    static async apiUpdateUser(req, res) {

        try {
            const newUser = new User(req.body)
            newUser.id = req.user.id

            if (newUser.username !== undefined) {
                const dbUser = await db.findUserByUsername(newUser.username)
                if (dbUser && newUser.id !== dbUser.id) return res.status(400).send({ error: 'username taken' })
                if (!newUser.validateUsername()) return res.status(400).send({ error: 'username is invalid' })
            } else {
                newUser.username = req.user.username
            }

            if (newUser.password !== undefined) {
                if (!newUser.validatePassword()) return res.status(400).send({ error: 'password too weak' })
                await newUser.hashPassword()
            } else {
                newUser.password = req.user.password
            }
            
            if (newUser.email !== undefined) {
                if (!newUser.validateEmail()) return res.status(400).send({ error: 'email is invalid' })
            } else {
                newUser.email = req.user.email
            }

            // Todo: send highscore with more control the game
            if (newUser.highscore === undefined || newUser.highscore < req.user.highscore) newUser.highscore = req.user.highscore

            await newUser.save()

            return res.send(newUser)

        } catch {
            return res.status(500).send()
        }

    }

    static async apiLogin(req, res) {
        
        try {
            const dbUser = await db.findUserByUsername(req.body.username)
    
            if (!dbUser) return res.status(403).send()

            const user = new User(dbUser)
            if (!await user.comparePassword(req.body.password)) return res.status(403).send()
            const token = await user.generateToken()
    
            return res
                    .cookie('access_token', token, {
                        httpOnly: true,
                        secure: config.getItem('https')
                    })
                    .send(user)
                
        } catch {
            return res.status(500).send()
        }

    }

    static async apiLogout(req, res) {

        try {
            await db.deleteTokenById(req.token.id)
            return res
                    .clearCookie('access_token')
                    .send()
    
        } catch {
            return res.status(500).send()
        }

    }

    static async apiLogoutAll(req, res) {

        try {
            await req.user.deleteAllTokens()
            return res
                    .clearCookie('access_token')
                    .send()
    
        } catch {
            return res.status(500).send()
        }

    }

    static apiProfile(req, res) {

        return res.send(req.user)

    }

    static async apiDeleteUser(req, res) {

        try {
            await req.user.delete()
            return res
                    .clearCookie('access_token')
                    .send()
    
        } catch {
            return res.status(500).send()
        }

    }

    static async apiLeaderboard(req, res) {

        try {
            res.send(await db.getLeaderboard())
        } catch (e) {
            res.status(500).send()
        }

    }

    static getRouter() {

        this.router = new express.Router()
        
        this.router.post('/users/new', this.apiNewUser)
        this.router.post('/users/login', this.apiLogin)
        this.router.post('/users/logout', this.authorization , this.apiLogout)
        this.router.post('/users/logoutall', this.authorization , this.apiLogoutAll)
        this.router.get('/users/me', this.authorization, this.apiProfile)
        this.router.patch('/users/me', this.authorization, this.apiUpdateUser)
        this.router.delete('/users/me', this.authorization, this.apiDeleteUser)
        this.router.get('/leaderboard', this.apiLeaderboard)
                
        return this.router

    }
}