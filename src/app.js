import express from 'express'
import cors from 'cors'
import { getFullPath } from './utils.js'
import { UserRouter } from './userrouter.js'
import { config } from './config.js'

export const app = express()

if (config.getItem('publicDirectory')) {
    const publicDirectoryPath =  getFullPath('../public')
    app.use(express.static(publicDirectoryPath))
}

app.use(express.json())

app.use(cors({
    origin: config.getItem('corsOrigin')
}))

app.use(UserRouter.getRouter())
