import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { Spacetime } from '../public/js/spacetime.js'
import { controls } from '../public/js/controls.js'


// Prepare mocks
game.createGame(document.body)


test('Should assign default data', () => {
    assert.deepEqual(controls.rotation, [])
    assert.deepEqual(controls.accelerate, false)
    assert.deepEqual(controls.fire, [])
    assert.deepEqual(controls.hyperspace, [])
    assert.deepEqual(controls.isTouch, false)
})


test('Should add event listeners', () => {
    // Prepare mocks
    let checkMock
    game.checkControls = () =>  checkMock = true

    controls.initializeEvents()

    checkMock = false
    document.dispatchEvent(new CustomEvent('keydown'))
    assert.deepEqual(checkMock, true)

    checkMock = false
    document.dispatchEvent(new CustomEvent('keyup'))
    assert.deepEqual(checkMock, true)

    checkMock = false
    game.mainDiv.dispatchEvent(new CustomEvent('mousedown'))
    assert.deepEqual(checkMock, true)

    checkMock = false
    game.mainDiv.dispatchEvent(new CustomEvent('mouseup'))
    assert.deepEqual(checkMock, true)
})


test('Should switch game.pause', () => {
    // Prepare mock
    const event = { code: 'KeyP' }
    Spacetime.spaceship = true

    controls.eventKeyDown(event)
    assert.deepEqual(game.pause, true)

    controls.eventKeyDown(event)
    assert.deepEqual(game.pause, false)
})


test('Should add left to rotation', () => {
    // Prepare mock
    const event = { code: 'KeyA' }

    assert.deepEqual(controls.rotation.length, 0)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.rotation.length, 1)
    assert.deepEqual(controls.rotation[0], 'left')
})


test('Should not add left to rotation', () => {
    // Prepare mock
    const event = { code: 'KeyA' }

    assert.deepEqual(controls.rotation.length, 1)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.rotation.length, 1)
})


test('Should add right to rotation', () => {
    // Prepare mock
    const event = { code: 'KeyD' }

    assert.deepEqual(controls.rotation.length, 1)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.rotation.length, 2)
    assert.deepEqual(controls.rotation[0], 'right')
})


test('Should not add right to rotation', () => {
    // Prepare mock
    const event = { code: 'KeyD' }

    assert.deepEqual(controls.rotation.length, 2)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.rotation.length, 2)
})


test('Should remove left from rotation', () => {
    // Prepare mock
    const event = { code: 'KeyA' }

    assert.deepEqual(controls.rotation.length, 2)
    controls.eventKeyUp(event)
    assert.deepEqual(controls.rotation.length, 1)
    assert.deepEqual(controls.rotation[0], 'right')
})


test('Should remove right from rotation', () => {
    // Prepare mock
    const event = { code: 'KeyD' }

    assert.deepEqual(controls.rotation.length, 1)
    controls.eventKeyUp(event)
    assert.deepEqual(controls.rotation.length, 0)
})


test('Should set accelerate to true', () => {
    // Prepare mock
    const event = { code: 'KeyW' }

    assert.deepEqual(controls.accelerate, false)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.accelerate, true)
})


test('Should set accelerate to false', () => {
    // Prepare mock
    const event = { code: 'KeyW' }

    assert.deepEqual(controls.accelerate, true)
    controls.eventKeyUp(event)
    assert.deepEqual(controls.accelerate, false)
})


test('Should add keyboard to fire', () => {
    // Prepare mock
    const event = { code: 'Space' }

    assert.deepEqual(controls.fire.length, 0)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.fire.length, 1)
    assert.deepEqual(controls.fire[0], 'keyboard')
})


test('Should not add keyboard to fire', () => {
    // Prepare mock
    const event = { code: 'Space' }

    assert.deepEqual(controls.fire.length, 1)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.fire.length, 1)
})


test('Should add mouse to fire', () => {
    // Prepare mock
    const event = { button: 0 }

    assert.deepEqual(controls.fire.length, 1)
    controls.eventMouseDown(event)
    assert.deepEqual(controls.fire.length, 2)
    assert.deepEqual(controls.fire[0], 'mouse')
})


test('Should not add mouse to fire', () => {
    // Prepare mock
    const event = { button: 0 }

    assert.deepEqual(controls.fire.length, 2)
    controls.eventMouseDown(event)
    assert.deepEqual(controls.fire.length, 2)
})


test('Should remove mouse from fire', () => {
    // Prepare mock
    const event = { button: 0 }

    assert.deepEqual(controls.fire.length, 2)
    controls.eventMouseUp(event)
    assert.deepEqual(controls.fire.length, 1)
    assert.deepEqual(controls.fire[0], 'keyboard')
})


test('Should remove keyboard from fire', () => {
    // Prepare mock
    const event = { code: 'Space' }

    assert.deepEqual(controls.fire.length, 1)
    controls.eventKeyUp(event)
    assert.deepEqual(controls.fire.length, 0)
})


test('Should add keyboard to hyperspace', () => {
    // Prepare mock
    const event = { code: 'KeyH' }

    assert.deepEqual(controls.hyperspace.length, 0)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.hyperspace.length, 1)
    assert.deepEqual(controls.hyperspace[0], 'keyboard')
})


test('Should not add keyboard to hyperspace', () => {
    // Prepare mock
    const event = { code: 'KeyH' }

    assert.deepEqual(controls.hyperspace.length, 1)
    controls.eventKeyDown(event)
    assert.deepEqual(controls.hyperspace.length, 1)
})


test('Should add mouse to hyperspace', () => {
    // Prepare mock
    const event = { button: 2 }

    assert.deepEqual(controls.hyperspace.length, 1)
    controls.eventMouseDown(event)
    assert.deepEqual(controls.hyperspace.length, 2)
    assert.deepEqual(controls.hyperspace[0], 'mouse')
})


test('Should not add mouse to hyperspace', () => {
    // Prepare mock
    const event = { button: 2 }

    assert.deepEqual(controls.hyperspace.length, 2)
    controls.eventMouseDown(event)
    assert.deepEqual(controls.hyperspace.length, 2)
})


test('Should remove keyboard from hyperspace', () => {
    // Prepare mock
    const event = { code: 'KeyH' }

    assert.deepEqual(controls.hyperspace.length, 2)
    controls.eventKeyUp(event)
    assert.deepEqual(controls.hyperspace.length, 1)
    assert.deepEqual(controls.hyperspace[0], 'mouse')
})


test('Should remove mouse from hyperspace', () => {
    // Prepare mock
    const event = { button: 2 }

    assert.deepEqual(controls.hyperspace.length, 1)
    controls.eventMouseUp(event)
    assert.deepEqual(controls.hyperspace.length, 0)
})
