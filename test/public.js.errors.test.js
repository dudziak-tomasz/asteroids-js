import assert from 'node:assert/strict'
import { test } from 'node:test'

import { messages } from '../public/js/messages.js'


test('Should return empty string', () => {
    // Prepare mocks
    const event = {
        getModifierState: () => false
    }

    const res = messages.getCapsLockError(event)
    assert.deepEqual(res, '')
})


test('Should return CapsLock message', () => {
    // Prepare mocks
    const event = {
        getModifierState: () => true
    }

    const res = messages.getCapsLockError(event)
    assert.deepEqual(res, 'CAPS LOCK IS ON!')
})