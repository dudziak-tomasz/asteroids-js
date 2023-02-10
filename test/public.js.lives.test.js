import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { lives } from '../public/js/lives.js'

// Prepare mocks
global.getComputedStyle = window.getComputedStyle


test('Should set default data', () => {
    assert.deepEqual(lives.lives, [])
    assert.deepEqual(lives.initialNumberOfLives, 3)
})


test('Should prepare canvas', () => {
    lives.initialize(document.body)

    assert.deepEqual(lives.canvas.constructor.name, 'HTMLDivElement')
    const $canvas = document.querySelector('div')
    assert.deepEqual($canvas, lives.canvas)
})


test('Should add life to array and to document', () => {
    lives.add()

    assert.deepEqual(lives.lives.length, 1)
    const $life = document.getElementById(lives.lives[0].id)
    assert.deepEqual($life, lives.lives[0].canvas)
})


test('Should restart lives', () => {
    lives.restart()

    assert.deepEqual(lives.lives.length, 3)
    const $lives = lives.canvas.querySelectorAll('svg')
    assert.deepEqual($lives.length, 3)
})


test('Should remove one life', () => {
    lives.restart()
    lives.remove()
    assert.deepEqual(lives.lives.length, 2)

    const $lives = lives.canvas.querySelectorAll('svg')
    assert.deepEqual($lives.length, 2)
})


test('Should get true if there is life, and false if there is no life', () => {
    lives.restart()
    assert.deepEqual(lives.lives.length > 0, true)
    assert.deepEqual(lives.isLife(), true)

    lives.remove()
    assert.deepEqual(lives.lives.length > 0, true)
    assert.deepEqual(lives.isLife(), true)

    lives.remove()
    assert.deepEqual(lives.lives.length > 0, true)
    assert.deepEqual(lives.isLife(), true)

    lives.remove()
    assert.deepEqual(lives.lives.length === 0, true)
    assert.deepEqual(lives.isLife(), false)
})