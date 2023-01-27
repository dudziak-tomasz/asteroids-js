import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Missile } from '../public/js/missile.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new missile and assign default data', () => {
    Spacetime.createSpacetime(document.body)
    const missile = new Missile()
    assert.deepEqual(missile.id.startsWith('missile'), true)
    assert.deepEqual(missile.canvas.id, missile.id)
    assert.deepEqual(missile.isAlien, false)
    assert.deepEqual(missile.maxSpeed, 6)
    assert.deepEqual(missile.timeOfDestruction, 144)
    assert.deepEqual(missile.counterOfDestruction, 1)
    assert.deepEqual(missile.left, -1)
    assert.deepEqual(missile.top, -1)
    assert.deepEqual(missile.speedX, 0)
    assert.deepEqual(missile.speedY, -6)
    assert.deepEqual(missile.audio.src, '/audio/fire.mp3')
    assert.deepEqual(missile.audio.volume, 0.9)
})


test('Should create new missile and assign given data', () => {
    const startPoint = {
        x: 100,
        y: 200    
    }
    const direction = {
        angle: 90,
        speedX: 10,
        speedY: -10
    }
    const options = {
        idPrefix: 'alien-missile',
        speedRatio: 0.5
    }

    const missile = new Missile(startPoint, direction, options)
    assert.deepEqual(missile.isAlien, true)
    assert.deepEqual(missile.maxSpeed, 3)
    assert.deepEqual(missile.timeOfDestruction, 144)
    assert.deepEqual(missile.counterOfDestruction, 1)
    assert.deepEqual(missile.left, 99)
    assert.deepEqual(missile.top, 199)
    assert.deepEqual(missile.speedX, 13)
    assert.deepEqual(missile.speedY, -10)
    assert.deepEqual(missile.audio.src, '/audio/fire_saucer.mp3')
})


test('Should increase counterOfDestruction by 1', () => {
    const missile = new Missile()
    assert.deepEqual(missile.counterOfDestruction, 1)
    missile.draw()
    assert.deepEqual(missile.counterOfDestruction, 2)
})


test('Should remove from Spacetime.missiles after 144 steps', () => {
    Spacetime.createSpacetime(document.body)
    const missile = new Missile()
    Spacetime.addMissile(missile)
    for (let i = 0; i < 143; i++) missile.draw()
    assert.deepEqual(Spacetime.missiles.size, 1)
    missile.draw()
    assert.deepEqual(Spacetime.missiles.size, 0)
})