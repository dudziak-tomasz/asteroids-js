import { db } from '../src/db/db.js'

import { configTest } from './src.config.test.js'
import { dbTest } from './src.db.db.test.js'
import { chatServerTest } from './src.chatserver.test.js'
import { userTest } from './src.user.test.js'
import { userRouterTest } from './src.userrouter.test.js'

console.time('TEST TIME')


db.connect()

configTest()
await dbTest()
await chatServerTest()
await userTest()
await userRouterTest()

db.disconnect()

console.log()
console.log('+------------------+')
console.log('| ALL TESTS PASSED |')
console.log('+------------------+')
console.log()
console.timeEnd('TEST TIME')
console.log()
