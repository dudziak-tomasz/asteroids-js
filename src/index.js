import fs from 'fs'
import http from 'http'
import https from 'https'
import { db } from './db/db.js'
import { config } from './config.js'
import { ChatServer } from './chatserver.js'
import { app } from './app.js'

db.connect()

const httpPort = config.getItem('httpPort')

if (httpPort) {

    const httpServer = http.createServer(app)

    new ChatServer(httpServer, {
        cors: {
            origin: config.getItem('corsOrigin')
        }
    })

    httpServer.listen(httpPort, () => {
        console.log(`http server is up on port ${httpPort}`)
    })

}

const httpsPort = config.getItem('httpsPort')

if (httpsPort) {

    const credentials = {
        key: fs.readFileSync(config.getItem('sslKey')), 
        cert: fs.readFileSync(config.getItem('sslCert'))
    }

    const httpsServer = https.createServer(credentials, app)

    new ChatServer(httpsServer, {
        cors: {
            origin: config.getItem('corsOrigin')
        }
    })

    httpsServer.listen(httpsPort, () => {
        console.log(`https server is up on port ${httpsPort}`)
    })

}

process.on('SIGTERM', () => console.log((new Date()).toLocaleString(), 'SIGTERM'))