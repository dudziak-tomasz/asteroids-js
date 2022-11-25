import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from './config.js'
import { db } from './db/db.js'

export class User {
    constructor(user = {}) {

        if (user.id) this.id = user.id
        if (user.username || user.username === '') this.username = user.username.trim().toLowerCase()
        if (user.password || user.password === '') this.password = user.password.trim()
        if (user.email || user.email === '') this.email = user.email.trim()
        if (user.highscore || user.highscore === 0) this.highscore = user.highscore    

    }

    toJSON() {

        const user = new User(this)
        delete user.password

        return user

    }

    validateUsername() {

        if (!this.username) return false
        if (this.username.length < 3) return false

        return true
    }

    validatePassword() {

        if (!this.password) return false
        if (this.password.toLowerCase().includes('password')) return false
        if (this.password.toLowerCase().includes('qwerty')) return false
        if (this.password.length < 6) return false

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

            if (!newUser.validateUsername()) return res.status(400).send({ error: 'username too short' })
            if (!newUser.validatePassword()) return res.status(400).send({ error: 'password too weak' })

            newUser.password = await bcrypt.hash(newUser.password, 8)

            // Todo: how to send highscore
            newUser.highscore = 0

            newUser.id = await db.addUser(newUser)

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

            if (newUser.username) {
                const dbUser = await db.findUserByUsername(newUser.username)
                if (dbUser && newUser.username === dbUser.username && newUser.id !== dbUser.id) return res.status(400).send({ error: 'username taken' })
                if (!newUser.validateUsername()) return res.status(400).send({ error: 'username too short' })
            } else {
                newUser.username = req.user.username
            }

            if (newUser.password) {
                if (!newUser.validatePassword()) return res.status(400).send({ error: 'password too weak' })
                newUser.password = await bcrypt.hash(newUser.password, 8)
            } else {
                newUser.password = req.user.password
            }
            
            if (!newUser.email) newUser.email = req.user.email

            // Todo: how to send highscore
            // newUser.highscore = 0
            if (!(newUser.highscore > req.user.highscore)) newUser.highscore = req.user.highscore

            await db.updateUser(newUser)

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

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if (!isMatch) return res.status(403).send()
    
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
            await db.deleteTokensByUserId(req.user.id)
    
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
            db.deleteTokensByUserId(req.user.id)
            db.deleteUserById(req.user.id)
    
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