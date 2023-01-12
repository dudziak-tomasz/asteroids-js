import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { ComplexFlyingObject } from '../public/js/complexflyingobject.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create complexFlyingObject and assign data', () => {
    const complexFO = new ComplexFlyingObject()
    assert.deepEqual(complexFO.lineThickness, 2)
    assert.deepEqual(complexFO.canvas.constructor.name, 'SVGSVGElement')
    assert.deepEqual(complexFO.canvas.style.position, 'absolute')
    assert.deepEqual(complexFO.polygon.constructor.name, 'SVGElement')
    assert.deepEqual(complexFO.polygon.getAttributeNS(undefined, 'fill'), 'none')
    assert.deepEqual(complexFO.polygon.getAttributeNS(undefined, 'stroke'), 'white')
    assert.deepEqual(complexFO.polygon.getAttributeNS(undefined, 'stroke-width'), '2')
    const $polygon = complexFO.canvas.querySelector('polygon')
    assert.deepEqual($polygon, complexFO.polygon)
})


test('Should change style after .move()', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 10
    complexFO.top = 10
    complexFO.speedX = 2
    complexFO.speedY = -3
    complexFO.rotation = 15
    complexFO.move()
    assert.deepEqual(complexFO.canvas.style.left, '12px')
    assert.deepEqual(complexFO.canvas.style.top, '7px')
    assert.deepEqual(complexFO.canvas.style.transform, 'rotate(15deg)')
})


test('Should be hit by missile', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 10
    complexFO.top = 10
    complexFO.width = 20
    complexFO.height = 20

    // Prepare mocks
    const missile = {
        left: 15,
        top: 15,
        width: 3,
        height:3
    }

    assert.ok(complexFO.isHitByMissile(missile))
})


test('Should not be hit by missile', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 10
    complexFO.top = 10
    complexFO.width = 20
    complexFO.height = 20

    // Prepare mocks
    const missile = {
        left: 5,
        top: 5,
        width: 3,
        height:3
    }

    assert.ok(!complexFO.isHitByMissile(missile))
})


test('Should be hit by something bigger 1', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 0
    complexFO.top = 0
    complexFO.width = 100
    complexFO.height = 100

    // Prepare mocks
    const somethingBigger = {
        left: 50,
        top: 50,
        width: 100,
        height:100
    }

    assert.ok(complexFO.isHitBy(somethingBigger))
})


test('Should be hit by something bigger 2', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 0
    complexFO.top = 0
    complexFO.width = 100
    complexFO.height = 100

    // Prepare mocks
    const somethingBigger = {
        left: -50,
        top: 50,
        width: 100,
        height:100
    }

    assert.ok(complexFO.isHitBy(somethingBigger))
})


test('Should be hit by something bigger 3', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 0
    complexFO.top = 0
    complexFO.width = 100
    complexFO.height = 100

    // Prepare mocks
    const somethingBigger = {
        left: -50,
        top: -50,
        width: 100,
        height:100
    }

    assert.ok(complexFO.isHitBy(somethingBigger))
})


test('Should be hit by something bigger 4', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 0
    complexFO.top = 0
    complexFO.width = 100
    complexFO.height = 100

    // Prepare mocks
    const somethingBigger = {
        left: 50,
        top: -50,
        width: 100,
        height:100
    }

    assert.ok(complexFO.isHitBy(somethingBigger))
})


test('Should not be hit by something bigger', () => {
    const complexFO = new ComplexFlyingObject()
    complexFO.left = 0
    complexFO.top = 0
    complexFO.width = 100
    complexFO.height = 100

    // Prepare mocks
    const somethingBigger = {
        left: 200,
        top: 200,
        width: 100,
        height:100
    }

    assert.ok(!complexFO.isHitBy(somethingBigger))
})
