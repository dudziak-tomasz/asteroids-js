import assert from 'assert'
import { test } from 'node:test'
import { getFullPath, sendMail } from '../src/utils.js'


test('Should get full path to file', () => {
    const fullPath = getFullPath('../test/src.utils.test.js')
    assert.deepEqual(fullPath, process.argv[1])
})


test('Should send email', () => {
    const isSend = sendMail('test@doitjs.eu', 'Test subject', 'Test body')
    assert.ok(isSend)
})
