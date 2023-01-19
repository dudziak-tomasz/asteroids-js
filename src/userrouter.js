import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from './user.js'
import { config } from './config.js'
import { db } from './db/db.js'
import { sendMail } from './utils.js'
import { ChatServer } from './chatserver.js'

export class UserRouter {

    static async authorization (req, res, next) {
        try {
            const { user, token } = await UserRouter.getUserAndTokenByHeaderToken(req)

            req.user = new User(user)
            req.token = token

            return next()
        } catch {
            return res.status(403).send()
        }  
    }

    static async getUserAndTokenByHeaderToken(req, reason = '') {
        const headerAuth = req.header('Authorization')
        const token = headerAuth ? headerAuth.replace('Bearer ', '') : undefined
        if (!token) throw new Error()

        const data = jwt.verify(token, config.getItem('tokenKey'))

        const dbUser = await db.findUserById(data.id)
        if (!dbUser) throw new Error()

        const dbToken = await db.findToken(dbUser.id, token, reason)
        if (!dbToken) throw new Error()

        return { user: dbUser, token: dbToken}
    }

    static async apiNewUser(req, res) {
        try {
            const newUser = new User(req.body)

            let dbUser = await db.findUserByUsername(newUser.username)
            if (dbUser) return res.status(400).send({ error: 'username taken' })

            if (!newUser.validateUsername()) return res.status(400).send({ error: 'username is invalid' })
            if (!newUser.validatePassword()) return res.status(400).send({ error: 'password too weak' })
            if (!newUser.validateEmail()) return res.status(400).send({ error: 'email is invalid' })

            if (newUser.email) {
                dbUser = await db.findUserByEmail(newUser.email)
                if (dbUser) return res.status(400).send({ error: 'email taken' })
            }
            
            await newUser.hashPassword()
            newUser.highscore = 0   // highscore can be updated only by update endpoint

            await newUser.save()
            await newUser.generateToken()
    
            return res.status(201).send(newUser)
        } catch {
            return res.status(500).send()
        }
    }

    static async apiUpdateUser(req, res) {
        try {
            const userUpdate = new User(req.body)
            userUpdate.id = req.user.id

            if (userUpdate.username === undefined) userUpdate.username = req.user.username
            else {
                const dbUser = await db.findUserByUsername(userUpdate.username)
                const isUsernameTaken = dbUser && userUpdate.id !== dbUser.id
                if (isUsernameTaken) return res.status(400).send({ error: 'username taken' })
                if (!userUpdate.validateUsername()) return res.status(400).send({ error: 'username is invalid' })                
            }

            if (userUpdate.password === undefined) userUpdate.password = req.user.password
            else {
                if (!userUpdate.validatePassword()) return res.status(400).send({ error: 'password too weak' })
                await userUpdate.hashPassword()                
            }

            if (userUpdate.email === undefined) userUpdate.email = req.user.email
            else if (userUpdate.email !== '') {        
                const dbUser = await db.findUserByEmail(userUpdate.email)
                const isEmailTaken = dbUser && userUpdate.id !== dbUser.id
                if (isEmailTaken) return res.status(400).send({ error: 'email taken' })
                if (!userUpdate.validateEmail()) return res.status(400).send({ error: 'email is invalid' })
            }                

            if (userUpdate.highscore === undefined) userUpdate.highscore = req.user.highscore
            else if (userUpdate.highscore <= req.user.highscore) userUpdate.highscore = req.user.highscore
            else {
                const canUpdateHighscore = ChatServer.canUpdateHighscore(userUpdate.id, userUpdate.highscore)
                if (!canUpdateHighscore) return res.status(400).send({ error: 'highscore is invalid' })
            }                
            
            await userUpdate.save()

            return res.send(userUpdate)
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

            if (!req.body.checkPasswordOnly) await user.generateToken()

            return res.send(user)
        } catch {
            return res.status(500).send()
        }
    }

    static async apiPasswordReset(req, res) {
        try {
            if (!req.body.email) return res.status(400).send({ error: 'email is invalid' })

            const dbUser = await db.findUserByEmail(req.body.email)
            if (!dbUser) return res.status(403).send()

            const user = new User(dbUser)
            
            await db.deleteTokensByUserIdAndReason(user.id, 'passwordreset')
            const token = await user.generateToken('passwordreset')

            const tokenURL = `${req.get('referer')}?q=${token}`
            const emailHTML = `
                <p>Hello ${user.username.toUpperCase()}!</p>
                <p>We received a request to reset the password for your account.</p>
                <p>If you made this request, click the link below. If not, you can ignore this email.</p>
                <p><a href="${tokenURL}">${tokenURL}</a></p>
                <p>Clicking not working? Try pasting it into your browser.</p>
            `
            const isSent = await sendMail({
                to: user.email,
                subject: 'Password reset',
                body: emailHTML
            })

            if (!isSent) throw new Error()

            return res.send()
        } catch {
            return res.status(500).send()
        }
    }

    static async apiPasswordUpdate(req, res) {
        try {
            const { user } = await UserRouter.getUserAndTokenByHeaderToken(req, 'passwordreset')
    
            const userUpdate = new User(user)
            userUpdate.password = req.body.password

            if (!userUpdate.validatePassword()) return res.status(400).send({ error: 'password too weak' })

            await userUpdate.hashPassword()
            await userUpdate.save()
            db.deleteTokensByUserIdAndReason(user.id, 'passwordreset')

            return res.send()
        } catch {
            return res.status(403).send()
        }
    }

    static async apiLogout(req, res) {
        try {
            await db.deleteTokenById(req.token.id)
            return res.send()
        } catch {
            return res.status(500).send()
        }
    }

    static async apiLogoutAll(req, res) {
        try {
            await req.user.deleteAllTokens()
            return res.send()
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
            return res.send()
        } catch {
            return res.status(500).send()
        }
    }

    static async apiLeaderboard(req, res) {
        try {
            res.send(await db.getLeaderboard())
        } catch {
            res.status(500).send()
        }
    }

    static getRouter() {
        this.router = new express.Router()
        
        this.router.post('/users/new', this.apiNewUser)
        this.router.post('/users/login', this.apiLogin)
        this.router.post('/users/passwordreset', this.apiPasswordReset)
        this.router.patch('/users/passwordreset', this.apiPasswordUpdate)
        this.router.post('/users/logout', this.authorization , this.apiLogout)
        this.router.post('/users/logoutall', this.authorization , this.apiLogoutAll)
        this.router.get('/users/me', this.authorization, this.apiProfile)
        this.router.patch('/users/me', this.authorization, this.apiUpdateUser)
        this.router.delete('/users/me', this.authorization, this.apiDeleteUser)
        this.router.get('/leaderboard', this.apiLeaderboard)
                
        return this.router
    }
}