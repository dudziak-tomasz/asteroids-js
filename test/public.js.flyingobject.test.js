import assert from 'assert'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { FlyingObject } from '../public/js/flyingobject.js'

import './__mocks__/mock.spacetime.js'


test('Should create flyingObject and assign data', () => {
    const flyingObject = new FlyingObject()
    assert.deepEqual(flyingObject.left, 0)
    assert.deepEqual(flyingObject.top, 0)
    assert.deepEqual(flyingObject.width, 0)
    assert.deepEqual(flyingObject.height, 0)
    assert.deepEqual(flyingObject.angle, 0)
    assert.deepEqual(flyingObject.speedX, 0)
    assert.deepEqual(flyingObject.speedY, 0)
    assert.deepEqual(flyingObject.rotation, 0)
    assert.deepEqual(flyingObject.color, 'white')
})


test('Should move flyingOject to the left', () => {
    const flyingObject = new FlyingObject()
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedX = -1
    flyingObject.move()
    assert.deepEqual(flyingObject.left, -1)
    flyingObject.move()
    assert.deepEqual(flyingObject.left, -2)
})


test('Should move beyond the right edge', () => {
    const flyingObject = new FlyingObject()
    flyingObject.left = -11
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedX = -1
    flyingObject.move()
    assert.deepEqual(flyingObject.left, Spacetime.getWidth() - 1)
})


test('Should move flyingOject to the right', () => {
    const flyingObject = new FlyingObject()
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedX = 1
    flyingObject.move()
    assert.deepEqual(flyingObject.left, 1)
    flyingObject.move()
    assert.deepEqual(flyingObject.left, 2)
})


test('Should move beyond the left edge', () => {
    const flyingObject = new FlyingObject()
    flyingObject.left = Spacetime.getWidth() + 1
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedX = 1
    flyingObject.move()
    assert.deepEqual(flyingObject.left, -9)
})


test('Should move flyingOject to the top', () => {
    const flyingObject = new FlyingObject()
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedY = -1
    flyingObject.move()
    assert.deepEqual(flyingObject.top, -1)
    flyingObject.move()
    assert.deepEqual(flyingObject.top, -2)
})


test('Should move beyond the bottom edge', () => {
    const flyingObject = new FlyingObject()
    flyingObject.top = -11
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedY = -1
    flyingObject.move()
    assert.deepEqual(flyingObject.top, Spacetime.getHeight() - 1)
})


test('Should move flyingOject to the bottom', () => {
    const flyingObject = new FlyingObject()
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedY = 1
    flyingObject.move()
    assert.deepEqual(flyingObject.top, 1)
    flyingObject.move()
    assert.deepEqual(flyingObject.top, 2)
})


test('Should move beyond the top edge', () => {
    const flyingObject = new FlyingObject()
    flyingObject.top = Spacetime.getHeight() + 1
    flyingObject.width = 10
    flyingObject.height = 10
    flyingObject.speedY = 1
    flyingObject.move()
    assert.deepEqual(flyingObject.top, -9)
})


test('Should rotate', () => {
    const flyingObject = new FlyingObject()
    flyingObject.rotation = 5
    flyingObject.move()
    assert.deepEqual(flyingObject.angle, 5)
    flyingObject.move()
    assert.deepEqual(flyingObject.angle, 10)
    flyingObject.angle = 360
    flyingObject.move()
    assert.deepEqual(flyingObject.angle, 5)
    flyingObject.rotation = -10
    flyingObject.move()
    assert.deepEqual(flyingObject.angle, 355)
})