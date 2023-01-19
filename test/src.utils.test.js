import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getFullPath, sendMail } from '../src/utils.js'


test('Should get full path to file', () => {
    const fullPath = getFullPath('../test/src.utils.test.js')
    assert.deepEqual(fullPath, process.argv[1])
})


test('Should send email', async () => {
    const isSend = await sendMail({
        to: 'test@doitjs.eu', 
        subject: 'Test subject', 
        body: 'Test body'
    })
    assert.deepEqual(isSend, true)
})
