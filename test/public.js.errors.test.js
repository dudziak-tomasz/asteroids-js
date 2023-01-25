import assert from 'node:assert/strict'
import { test } from 'node:test'

import { errors } from '../public/js/errors.js'


test('Should return empty string', () => {
    // Prepare mocks
    const event = {
        getModifierState: () => false
    }

    const res = errors.getCapsLockError(event)
    assert.deepEqual(res, '')
})


test('Should return CapsLock message', () => {
    // Prepare mocks
    const event = {
        getModifierState: () => true
    }

    const res = errors.getCapsLockError(event)
    assert.deepEqual(res, 'CAPS LOCK IS ON!')
})