import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'


test('Should prepare game and assign main data', () => {
    game.createGame(document.body)

    assert.deepEqual(game.level, 0)
    assert.deepEqual(game.seconds, 0)
    assert.deepEqual(game.pointsForAsteroids, [0, 100, 50, 20])
    assert.deepEqual(game.pointsForSaucers, [0, 1000, 200])
    assert.deepEqual(game.pointsForNewLife, 10000)
    assert.deepEqual(game.pause, false)
    assert.deepEqual(game.timeBetweenLevels, 3000)
    assert.deepEqual(game.secondsBetweenSaucers, 15)
    assert.deepEqual(game.probabilityCreateSaucerInitial, 0.3)
    assert.deepEqual(game.probabilityCreateSaucer, 0.3)
    assert.deepEqual(game.noSaucerPoints, 2000)
    assert.deepEqual(game.largeSaucerPoints, 10000)
    assert.deepEqual(game.randomSaucerPoints, 40000)
    assert.deepEqual(game.isLevelStarting, false)
    assert.deepEqual(game.openBoxes, 0)
    assert.deepEqual(game.parentElement, document.body)
})


test('Should assign data for mainDiv', () => {
    assert.deepEqual(game.mainDiv.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.mainDiv.id, 'spacetime')
    const $mainDiv = document.getElementById('spacetime')
    assert.deepEqual($mainDiv, game.mainDiv)
})


test('Should assign data for canvasScoreAndLives', () => {
    assert.deepEqual(game.canvasScoreAndLives.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.canvasScoreAndLives.className, 'score-and-lives')
    const $canvasScoreAndLives = document.querySelector('.score-and-lives')
    assert.deepEqual($canvasScoreAndLives, game.canvasScoreAndLives)
})


test('Should assign data for background audio', () => {
    assert.deepEqual(game.audioTrack, 'background2.mp3')
    assert.deepEqual(game.audioVolume, 0.3)
    assert.ok(game.audio)
    assert.deepEqual(game.audio.loop, true)
    assert.deepEqual(game.audio.src, '/audio/background2.mp3')
    assert.deepEqual(game.audio.isPlaying, false)
})


test('Should assign data for state of game', () => {
    assert.deepEqual(game.pressFireTo, 'startgame')
})
