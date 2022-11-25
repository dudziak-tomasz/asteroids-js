import express from 'express'
import cookieParser from 'cookie-parser'
import { db } from './db/db.js'
import { getFullPath } from './utils.js'
import { User } from './user.js'

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath =  getFullPath('../public')

db.connect()

app.use(express.static(publicDirectoryPath))

app.use(express.json())

app.use(cookieParser())

app.use(User.getRouter())

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})