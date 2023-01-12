import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { SimpleFlyingObject } from '../public/js/simpleflyingobject.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create simpleFlyingObject and assign data', () => {
    const simpleFO = new SimpleFlyingObject()
    assert.deepEqual(simpleFO.width, 3)
    assert.deepEqual(simpleFO.height, 3)
    assert.deepEqual(simpleFO.canvas.constructor.name, 'HTMLDivElement')
    assert.deepEqual(simpleFO.canvas.style.backgroundColor, 'white')
    assert.deepEqual(simpleFO.canvas.style.position, 'absolute')
    assert.deepEqual(simpleFO.canvas.style.width, '3px')
    assert.deepEqual(simpleFO.canvas.style.height, '3px')
})


test('Should change style after .move()', () => {
    const simpleFO = new SimpleFlyingObject()
    simpleFO.left = 10
    simpleFO.top = 10
    simpleFO.speedX = 2
    simpleFO.speedY = -3
    simpleFO.move()
    assert.deepEqual(simpleFO.canvas.style.left, '12px')
    assert.deepEqual(simpleFO.canvas.style.top, '7px')
})