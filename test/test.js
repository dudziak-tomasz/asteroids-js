import jsdom from 'jsdom'
import { db } from '../src/db/db.js'

import { configTest } from './src.config.test.js'
import { dbTest } from './src.db.db.test.js'
import { chatServerTest } from './src.chatserver.test.js'
import { userTest } from './src.user.test.js'
import { userRouterTest } from './src.userrouter.test.js'
import { utilsTest } from './src.utils.test.js'
import { publicUtilsTest } from './public.js.utils.test.js'
import { publicConfigTest } from './public.js.config.test.js'
import { spacetimeTest } from './public.js.spacetime.test.js'
import { shardTest } from './public.js.shard.test.js'


// Prepare mocks for front-end
const { JSDOM } = jsdom
const dom = new JSDOM()
global.dom = dom
global.window = dom.window
global.document = dom.window.document
global.screen = {
    availWidth: 1920,
    availHeight: 1080    
}
global.localStorage = {
    getItem() {},
    setItem() {}
}


// Start tests
console.time('Time')
console.clear()
console.log('Testing...')
console.log()

db.connect()

// Back-end tests
configTest()
await dbTest()
await chatServerTest()
await userTest()
await userRouterTest()
utilsTest()

// Front-end tests
publicConfigTest()
publicUtilsTest()
spacetimeTest()
shardTest()

db.disconnect()

console.log('+------------------+')
console.log('| ALL TESTS PASSED |')
console.log('+------------------+')
console.log()
console.timeEnd('Time')
console.log()
