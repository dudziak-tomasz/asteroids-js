import express from 'express'
import { db } from './db/db.js'
import { leaderboardRouter } from './leaderboardrouter.js'
import { getFullPath } from './utils.js'

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath =  getFullPath('../public')

db.connect()

app.use(express.static(publicDirectoryPath))

app.use(express.json())

app.use(leaderboardRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})