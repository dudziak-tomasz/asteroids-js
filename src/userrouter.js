import express from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { db } from './db/db.js'

export const userRouter = new express.Router()

const authorization = async (req, res, next) => {
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

userRouter.post('/users/login', async (req, res) => {

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

})

userRouter.post('/users/logout', authorization , (req, res) => {

    try {
        db.deleteTokenById(req.token.id)

        return res
                .clearCookie('access_token')
                .send()

    } catch {
        return res.status(500).send()
    }

})

userRouter.post('/users/logoutall', authorization , (req, res) => {

    try {
        db.deleteTokenByUserId(req.user.id)

        return res
                .clearCookie('access_token')
                .send()

    } catch {
        return res.status(500).send()
    }

})

userRouter.get('/users/me', authorization, (req, res) => {
    return res.send(req.user)
})

