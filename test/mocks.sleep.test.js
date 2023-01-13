import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sleep } from './__mocks__/mock.sleep.js'


test('Should sleep for about 3000 ms', { skip: 'test only when sleep function changes because of time' }, async () => {
    const startDate = Date.now()
    await sleep(3000)
    const interval = Date.now() - startDate
    assert.deepEqual(3000 <= interval && interval <= 3100, true)
})