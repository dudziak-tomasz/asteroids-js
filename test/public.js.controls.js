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
    assert.deepEqual(controls.touchMoveSensitivity, 30)
    assert.deepEqual(controls.touchAccelerationSensitivity, 50)
    assert.deepEqual(controls.touchHyperspaceSensitivity, 100)
})


test('Should add mouse and keyboard event listeners', () => {
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


test('Should set isTouch to false', () => {
    controls.isTouch = true
    controls.eventMouseUp()
    assert.deepEqual(controls.isTouch, false)
})


test('Should set isTouch, touchStart after touchstart event', () => {
    // Prepare mocks
    const event = {
        targetTouches: [
            {
                clientX: 10,
                clientY: 10
            }
        ]
    }

    controls.eventTouchStart(event)
    assert.deepEqual(controls.isTouch, true)
    assert.deepEqual(controls.touchStart[0], {x: 10, y: 10})
})


test('Should add touch to fire and set rotation to []', () => {
    // Prepare mocks
    const event = {
        targetTouches: [
            {
                clientX: 10,
                clientY: 10
            }
        ]
    }

    controls.fire = []
    controls.rotation = ['left']
    controls.eventTouchStart(event)
    assert.deepEqual(controls.fire.length, 1)
    assert.deepEqual(controls.rotation, [])
})


test('Should not add touch to fire and not set rotation to []', () => {
    // Prepare mocks
    const event = {
        targetTouches: []
    }

    controls.fire = []
    controls.rotation = ['left']
    controls.eventTouchStart(event)
    assert.deepEqual(controls.fire.length, 0)
    assert.notDeepEqual(controls.rotation, [])
})


test('Should set touchEnd after touchmove event', () => {
    // Prepare mocks
    const event1 = {
        targetTouches: [
            {
                clientX: 10,
                clientY: 10
            }
        ]
    }
    const event2 = {
        targetTouches: [
            {
                clientX: 20,
                clientY: 20
            }
        ]
    }

    controls.eventTouchStart(event1)
    controls.eventTouchMove(event2)
    assert.deepEqual(controls.touchEnd[0], {x: 20, y: 20})
})


test('Should add left to rotation after touchmove event', () => {
    // Prepare mocks
    const event1 = {
        targetTouches: [
            {
                clientX: 100,
                clientY: 100
            }
        ]
    }
    const event2 = {
        targetTouches: [
            {
                clientX: 69,
                clientY: 100
            }
        ]
    }

    controls.rotation = []
    controls.eventTouchStart(event1)
    controls.eventTouchMove(event2)
    assert.deepEqual(controls.rotation[0], 'left')
})


test('Should add right to rotation after touchmove event', () => {
    // Prepare mocks
    const event1 = {
        targetTouches: [
            {
                clientX: 100,
                clientY: 100
            }
        ]
    }
    const event2 = {
        targetTouches: [
            {
                clientX: 131,
                clientY: 100
            }
        ]
    }

    controls.rotation = []
    controls.eventTouchStart(event1)
    controls.eventTouchMove(event2)
    assert.deepEqual(controls.rotation[0], 'right')
})


test('Should set accelerate after touchmove event', () => {
    // Prepare mocks
    const event1 = {
        targetTouches: [
            {
                clientX: 100,
                clientY: 100
            }
        ]
    }
    const event2 = {
        targetTouches: [
            {
                clientX: 100,
                clientY: 49
            }
        ]
    }

    controls.accelerate = false
    controls.eventTouchStart(event1)
    controls.eventTouchMove(event2)
    assert.deepEqual(controls.accelerate, true)
})


test('Should add touch to hyperspace after touchmove event', () => {
    // Prepare mocks
    const event1 = {
        targetTouches: [
            {
                clientX: 100,
                clientY: 100
            }
        ]
    }
    const event2 = {
        targetTouches: [
            {
                clientX: 100,
                clientY: 201
            }
        ]
    }

    controls.hyperspace = []
    controls.eventTouchStart(event1)
    controls.eventTouchMove(event2)
    assert.deepEqual(controls.hyperspace[0], 'touch')
})


test('Should reset data after touchend event', () => {
    controls.accelerate = true
    controls.fire = ['touch']
    controls.hyperspace = ['touch']

    controls.eventTouchEnd()

    assert.deepEqual(controls.accelerate, false)
    assert.deepEqual(controls.fire, [])
    assert.deepEqual(controls.hyperspace, [])
})


test('Should return true: isHyperspace()', () => {
    controls.hyperspace = ['touch']
    assert.deepEqual(controls.isHyperspace(), true)
})


test('Should return false: isHyperspace()', () => {
    controls.hyperspace = []
    assert.deepEqual(controls.isHyperspace(), false)
})


test('Should return true: isFire()', () => {
    controls.fire = ['mouse']
    assert.deepEqual(controls.isFire(), true)
})


test('Should return false: isFire()', () => {
    controls.fire = []
    assert.deepEqual(controls.isFire(), false)
})


test('Should return true: isRotation()', () => {
    controls.rotation = ['right']
    assert.deepEqual(controls.isRotation(), true)
})


test('Should return false: isRotation()', () => {
    controls.rotation = []
    assert.deepEqual(controls.isRotation(), false)
})


test('Should return right: rotationDirection()', () => {
    controls.rotation = ['right', 'left']
    assert.deepEqual(controls.rotationDirection(), 'right')
})


test('Should return left: rotationDirection()', () => {
    controls.rotation = ['left', 'right']
    assert.deepEqual(controls.rotationDirection(), 'left')
})


test('Should return true: isAccelerate()', () => {
    controls.accelerate = true
    assert.deepEqual(controls.isAccelerate(), true)
})


test('Should return false: isAccelerate()', () => {
    controls.accelerate = false
    assert.deepEqual(controls.isAccelerate(), false)
})


