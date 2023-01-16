import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getRandomID, getRandomPlusMinus, getRandomInteger, getScreenSize, getHDRatio, isPointInsideRectangle } from '../public/js/utils.js'

import './__mocks__/mock.dom.js'


test('Should get random ID', () => {
    const id1 = getRandomID()
    const id2 = getRandomID()
    assert.notDeepEqual(id1, id2, 'Should be different ids')
})


test('Should not generate duplicates', () => {
    const ids = new Set()
    for (let i = 0; i < 1000; i++) {
        const id = getRandomID()
        assert.deepEqual(ids.has(id), false)
        ids.add(id)
    }
})


test('Should starts with prefix', () => {
    const id = getRandomID('test')
    assert.deepEqual(id.startsWith('test'), true)
})


test('Should get random positive or negative number from a given range', () => {
    const x1 = 1.2
    const x2 = 3.8
    const x = getRandomPlusMinus(x1, x2)
    assert.deepEqual(-x2 <= x && x <= -x1 || x1 <= x && x <= x2, true)
})


test('Should get random natural number less than given one', () => {
    const iMax = 20
    const i = getRandomInteger(iMax)
    assert.deepEqual(typeof i, 'number', 'Should be a number')
    assert.deepEqual(i, Math.trunc(i), 'Should be integer')
    assert.deepEqual(0 <= i && i < iMax, true, 'Should be natural less than 20')
})


test('Should be point inside rectangle', () => {
    const point = {
        x: 50,
        y: 60
    }
    const rectangle = {
        left: 20,
        top: 30,
        width: 100,
        height: 100
    }

    let isInside = isPointInsideRectangle(point, rectangle)
    assert.deepEqual(isInside, true)

    rectangle.width = 31
    isInside = isPointInsideRectangle(point, rectangle)
    assert.deepEqual(isInside, true)

    rectangle.height = 31
    isInside = isPointInsideRectangle(point, rectangle)
    assert.deepEqual(isInside, true)
})


test('Should not be point inside rectangle', () => {
    const point = {
        x: 50,
        y: 60
    }
    const rectangle = {
        left: 20,
        top: 30,
        width: 30,
        height: 100
    }

    const isInside = isPointInsideRectangle(point, rectangle)
    assert.deepEqual(isInside, false)
})


test('Should get smaller value of screen size', () => {
    // Prepare mocks
    global.screen = {
        availWidth: 1920,
        availHeight: 1080    
    }

    const size1 = getScreenSize()
    assert.deepEqual(size1, 1080)

    global.screen = {
        availWidth: 400,
        availHeight: 1000    
    }
    const size2 = getScreenSize()
    assert.deepEqual(size2, 400)
})


test('Should get ratio between 0.7 and 1.3', () => {
    // Prepare mocks
    global.screen = {
        availWidth: 1920,
        availHeight: 1080    
    }

    const ratio1 = getHDRatio()
    assert.deepEqual(0.7 <= ratio1 && ratio1 <= 1.3, true)

    // Prepare mocks
    global.screen = {
        availWidth: 10000,
        availHeight: 10000    
    }

    const ratio2 = getHDRatio()
    assert.deepEqual(0.7 <= ratio2  && ratio2 <= 1.3, true)

    // Prepare mocks
    global.screen = {
        availWidth: 400,
        availHeight: 400    
    }

    const ratio3 = getHDRatio()
    assert.deepEqual(0.7 <= ratio3  && ratio3 <= 1.3, true)
})
