import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { api } from '../public/js/api.js'
import { highscore } from '../public/js/highscore.js'


test('Should prepre canvas', () => {
    highscore.initialize(document.body)

    assert.deepEqual(highscore.canvas.constructor.name, 'HTMLDivElement')
    assert.deepEqual(highscore.canvas.className, 'high-score')
    const $canvas = document.querySelector('.high-score')
    assert.deepEqual($canvas, highscore.canvas)
})


test('Should refresh highscore without username', () => {
    // Prepare mock
    api.user = undefined

    highscore.highscore = 1000
    highscore.refresh()

    assert.deepEqual(highscore.canvas.innerHTML, '1000 ')
})


test('Should refresh highscore with username', () => {
    // Prepare mock
    api.user = { username: 'user1'}

    highscore.highscore = 1000
    highscore.refresh()

    assert.deepEqual(highscore.canvas.innerHTML, '1000 USER1')
})


test('Should save highscore in localStorage', () => {
    // Prepare mock
    api.user = undefined

    highscore.highscore = 1000
    highscore.setAndRefresh()

    assert.deepEqual(localStorage.getItem('highScore'), 1000)
})


test('Should save highscore in api', () => {
    // Prepare mock
    api.user = { username: 'user1'}

    highscore.highscore = 1000
    highscore.setAndRefresh()

    assert.deepEqual(api.user.highscore, 1000)
})


test('Should get highscore from localStorage', () => {
    // Prepare mock
    api.user = undefined
    localStorage.setItem('highScore', 13000)

    highscore.getAndRefresh()
    assert.deepEqual(highscore.highscore, 13000)
})


test('Should not get highscore from localStorage and set highscore in localStorage', () => {
    // Prepare mock
    api.user = undefined
    localStorage.clear()

    highscore.highscore = 9000
    highscore.getAndRefresh()
    assert.deepEqual(highscore.highscore, 9000)
    assert.deepEqual(localStorage.getItem('highScore'), 9000)
})


test('Should get highscore from api', () => {
    // Prepare mock
    api.user = { 
        username: 'user1',
        highscore: 12000
    }

    highscore.getAndRefresh()
    assert.deepEqual(highscore.highscore, 12000)
})


test('Should add custom events listeners', () => {
    // Prepare mocks
    let listener
    highscore.getAndRefresh = () => listener = true

    highscore.initializeCustomEvents()

    listener = false
    highscore.parentElement.dispatchEvent(new CustomEvent('login'))
    assert.deepEqual(listener, true)

    listener = false
    highscore.parentElement.dispatchEvent(new CustomEvent('logout'))
    assert.deepEqual(listener, true)

    listener = false
    highscore.parentElement.dispatchEvent(new CustomEvent('username'))
    assert.deepEqual(listener, true)
})