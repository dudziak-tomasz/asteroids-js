import express from 'express'
import { db } from './db/db.js'

export const leaderboardRouter = new express.Router()

leaderboardRouter.get('/leaderboard', async (req, res) => {

    try {
        // setTimeout(async () => {
        //     res.send(await db.getLeaderboard()) 
        // }, 3000)
        res.send(await db.getLeaderboard())
    } catch (e) {
        res.status(500).send()
    }
    
})

