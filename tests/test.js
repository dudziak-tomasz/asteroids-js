import { db } from '../src/db/db.js'

import { configTest } from './src.config.test.js'
import { dbTest } from './src.db.db.test.js'
import { chatServerTest } from './src.chatserver.test.js'


// config.js should be tested first, because is used by db.js
configTest()

db.connect()

await dbTest()
await chatServerTest()

db.disconnect()

console.log()
console.log('+------------------+')
console.log('| ALL TESTS PASSED |')
console.log('+------------------+')
console.log()
