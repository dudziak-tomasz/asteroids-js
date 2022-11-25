import { db } from './db.js'

db.connect()

await db.initializeDB()

db.disconnect()