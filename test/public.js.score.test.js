import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { game } from '../public/js/game.js'
import { chat } from '../public/js/chat.js'
import { highscore } from '../public/js/highscore.js'
import { sleep } from './__mocks__/mock.sleep.js'
import { score } from '../public/js/score.js'


test('Should set defaul data', () => {
    assert.deepEqual(score.score, 0)
    assert.deepEqual(score.timeBlink, 1000)
})


test('Should prepare canvas and set innerHTML', () => {
    score.initialize(document.body)

    assert.deepEqual(score.canvas.constructor.name, 'HTMLDivElement')
    const $canvas = document.querySelector('div')
    assert.deepEqual($canvas, score.canvas)
    assert.deepEqual(score.canvas.innerHTML, '0')
})


test('Should set new score on canvas', () => {
    // Prepare mocks
    highscore.highscore = 2000

    score.score = 1000
    score.refresh()
    assert.deepEqual(score.canvas.innerHTML, '1000')
})


test('Should set new score and refresh canvas', () => {
    // Prepare mocks
    highscore.highscore = 2000

    score.setAndRefresh(1000)
    assert.deepEqual(score.canvas.innerHTML, '1000')
})


test('Should blink score', async () => {
    score.timeBlink = 5
    assert.deepEqual(score.canvas.className, '')
    score.blink()
    assert.deepEqual(score.canvas.className, 'score-blink')
    await sleep(10)
    assert.deepEqual(score.canvas.className, '')
})


test('Should set highscore and blink', () => {
    // Prepare mocks
    highscore.highscore = 2000
    highscore.achieved = false
    highscore.setAndRefresh = (score) => highscore.highscore = score
    score.timeBlink = 5
    score.canvas.className = ''

    score.score = 3000
    score.refresh()
    assert.deepEqual(score.canvas.innerHTML, '3000')
    assert.deepEqual(highscore.highscore, 3000)
    assert.deepEqual(score.canvas.className, 'score-blink')
})


test('Should set highscore and not blink', () => {
    // Prepare mocks
    highscore.highscore = 2000
    highscore.achieved = true
    highscore.setAndRefresh = (score) => highscore.highscore = score
    score.timeBlink = 5
    score.canvas.className = ''

    score.score = 3000
    score.refresh()
    assert.deepEqual(score.canvas.innerHTML, '3000')
    assert.deepEqual(highscore.highscore, 3000)
    assert.deepEqual(score.canvas.className, '')
})


test('Should add points and refresh canvas', () => {
    // Prepare mocks
    highscore.highscore = 2000
    score.score = 1000

    score.addPoints(100)
    assert.deepEqual(score.score, 1100)
    assert.deepEqual(score.canvas.innerHTML, '1100')
})


test('Should call game.extraLife() and chat.updateScore() after passing 10000 points', () => {
    // Prepare mocks
    let extraLifeMock = false, updateScoreMock = 0
    game.extraLife = () => extraLifeMock = true
    chat.updateScore = (newScore) => updateScoreMock = newScore

    highscore.highscore = 30000
    score.score = 19990

    score.addPoints(100)
    assert.deepEqual(extraLifeMock, true)
    assert.deepEqual(updateScoreMock, 20090)
})


test('Should set score = 0 and refresh canvas', () => {
    score.restart()
    assert.deepEqual(score.score, 0)
    assert.deepEqual(score.canvas.innerHTML, '0')
})


