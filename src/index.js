import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { db } from './db/db.js'
import { getFullPath } from './utils.js'
import { User } from './user.js'
import { config } from './config.js'

const app = express()
const httpPort = config.getItem('httpPort')

db.connect()

if (config.getItem('publicDirectory')) {
    const publicDirectoryPath =  getFullPath('../public')
    app.use(express.static(publicDirectoryPath))
}

app.use(express.json())

app.use(cookieParser())

app.use(cors({
    origin: config.getItem('corsOrigin')
}))

app.use(User.getRouter())

if (httpPort) {
    app.listen(httpPort, () => {
        console.log(`Server is up on port ${httpPort}`)
    })
}
