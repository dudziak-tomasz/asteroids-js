import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { db } from './db/db.js'
import { getFullPath } from './utils.js'
import { User } from './user.js'
import { config } from './config.js'

const app = express()
const httpPort = config.getItem('httpPort')
const httpsPort = config.getItem('httpsPort')

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

    const httpServer = http.createServer(app)

    httpServer.listen(httpPort, () => {
        console.log(`http server is up on port ${httpPort}`)
    })

}

if (httpsPort) {

    const credentials = {
        key: fs.readFileSync('config/asteroids.key'), 
        cert: fs.readFileSync('config/asteroids.crt')
    }

    const httpsServer = https.createServer(credentials, app)

    httpsServer.listen(httpsPort, () => {
        console.log(`https server is up on port ${httpsPort}`)
    })

}
