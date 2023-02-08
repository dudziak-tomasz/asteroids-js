import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { alert } from '../public/js/alert.js'


test('Should prepare canvas', () => {
    alert.initialize(document.body)

    assert.deepEqual(alert.canvas.constructor.name, 'HTMLDivElement')
    assert.deepEqual(alert.canvas.className, 'alert')
    const $canvas = document.querySelector('.alert')
    assert.deepEqual($canvas, alert.canvas)
})


test('Should hide alert', () => {
    alert.hide()
    assert.deepEqual(alert.canvas.className, 'alert-hidden')
})


test('Should show alert', () => {
    alert.show('testing')

    assert.deepEqual(alert.canvas.innerHTML, 'testing')
    assert.deepEqual(alert.canvas.className, 'alert')
})