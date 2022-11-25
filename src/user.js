import express from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { db } from './db/db.js'

export class User {
    constructor(user = {}) {

        this.id = user.id
        this.username = user.username
        this.password = user.password
        this.email = user.email
        this.highscore = user.highscore

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
    
            delete (user.password)
            req.user = user
            req.token = dbToken
    
            return next()
        } catch {
            return res.status(403).send()
        }
    
    }

    static async apiLogin(req, res) {
        
        try {
            const user = await db.findUserByUsername(req.body.username)
    
            if (!user) return res.status(403).send()
    
            if (user.password !== req.body.password) return res.status(403).send()
    
            const token = jwt.sign({ id: user.id }, config.getItem('tokenKey'))
    
            db.addToken(user.id, token)
    
            delete user.password
    
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

    static async apiLeaderboard(req, res) {

        try {
            // setTimeout(async () => {
            //     res.send(await db.getLeaderboard()) 
            // }, 2000)
            res.send(await db.getLeaderboard())
        } catch (e) {
            res.status(500).send()
        }

    }

    static getRouter() {

        this.router = new express.Router()
        this.router.post('/users/login', this.apiLogin)
        this.router.post('/users/logout', this.authorization , this.apiLogout)
        this.router.post('/users/logoutall', this.authorization , this.apiLogoutAll)
        this.router.get('/users/me', this.authorization, this.apiProfile)
        this.router.get('/leaderboard', this.apiLeaderboard)
                
        return this.router

    }
}