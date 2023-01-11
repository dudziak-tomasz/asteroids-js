import assert from 'assert'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'


test('Should create div', () => {
    const canvas = document.createElement('div')
    canvas.id = 'spacetime'
    canvas.style.position = 'fixed'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.backgroundColor = 'black'
    canvas.style.top = '0'
    canvas.style.left = '0'
    document.body.appendChild(canvas)
    const $canvas = document.getElementById('spacetime')
    assert.deepEqual($canvas, canvas)
})


test('Should get null for non-existent key in localStorage', () => {
    const res = localStorage.getItem('test_key')
    assert.deepEqual(res, null)
})


test('Should set and get value from localStorage', () => {
    localStorage.setItem('test_key', 'test_value')
    const res = localStorage.getItem('test_key')
    assert.deepEqual(res, 'test_value')
})


test('Should set and get two different keys/values from localStorage', () => {
    localStorage.setItem('test_key1', 'test_value1')
    localStorage.setItem('test_key2', 'test_value2')
    const res1 = localStorage.getItem('test_key1')
    const res2 = localStorage.getItem('test_key2')
    assert.deepEqual(res1, 'test_value1')
    assert.deepEqual(res2, 'test_value2')
})


test('Should remove value from localStorage', () => {
    localStorage.setItem('test_key3', 'test_value3')
    const res1 = localStorage.getItem('test_key3')
    assert.deepEqual(res1, 'test_value3')
    localStorage.removeItem('test_key3')
    const res2 = localStorage.getItem('test_key3')
    assert.deepEqual(res2, null)
})


test('Should create instance of Audio', () => {
    const audio = new Audio()
    assert.ok(audio)
})

