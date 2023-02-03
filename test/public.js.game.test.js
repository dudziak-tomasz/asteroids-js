import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'


test('Should prepare game and assign main data', () => {
    game.createGame(document.body)

    assert.deepEqual(game.level, 0)
    assert.deepEqual(game.score, 0)
    assert.deepEqual(game.highscore, 0)
    assert.deepEqual(game.seconds, 0)
    assert.deepEqual(game.highscoreAchieved, false)
    assert.deepEqual(game.scoreForAsteroids, [0, 100, 50, 20])
    assert.deepEqual(game.scoreForSaucers, [0, 1000, 200])
    assert.deepEqual(game.scoreForNewLife, 10000)
    assert.deepEqual(game.lives, [])
    assert.deepEqual(game.numberOfLives, 3)
    assert.deepEqual(game.pause, false)
    assert.deepEqual(game.rotation, [])
    assert.deepEqual(game.accelerate, false)
    assert.deepEqual(game.fire, [])
    assert.deepEqual(game.hyperspace, [])
    assert.deepEqual(game.timeBetweenLevels, 3000)
    assert.deepEqual(game.timeBlinkScore, 1000)
    assert.deepEqual(game.timeBetweenSaucers, 15)
    assert.deepEqual(game.probabilityCreateSaucerInit, 0.3)
    assert.deepEqual(game.probabilityCreateSaucer, 0.3)
    assert.deepEqual(game.typeOfSaucer, [2000, 10000, 40000])
    assert.deepEqual(game.isLevelStarting, false)
    assert.deepEqual(game.isTouch, false)
    assert.deepEqual(game.openBoxes, 0)
    assert.deepEqual(game.parentElement, document.body)
})


test('Should assign data for mainDiv', () => {
    assert.deepEqual(game.mainDiv.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.mainDiv.id, 'spacetime')
    assert.deepEqual(game.mainDiv.style.position, 'fixed')
    assert.deepEqual(game.mainDiv.style.width, '100vw')
    assert.deepEqual(game.mainDiv.style.height, '100vh')
    assert.deepEqual(game.mainDiv.style.width, '100vw')
    assert.deepEqual(game.mainDiv.style.backgroundColor, 'black')
    assert.deepEqual(game.mainDiv.style.top, '0px')
    assert.deepEqual(game.mainDiv.style.left, '0px')
    const $mainDiv = document.getElementById('spacetime')
    assert.deepEqual($mainDiv, game.mainDiv)
})


test('Should assign data for canvasAlert', () => {
    assert.deepEqual(game.canvasAlert.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.canvasAlert.className, 'alert')
    const $canvasAlert = document.querySelector('.alert')
    assert.deepEqual($canvasAlert, game.canvasAlert)
})


test('Should assign data for canvasScore', () => {
    assert.deepEqual(game.canvasScore.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.canvasScore.className, 'score')
    const $canvasScore = document.querySelector('.score')
    assert.deepEqual($canvasScore, game.canvasScore)
})


test('Should assign data for canvasHighscore', () => {
    assert.deepEqual(game.canvasHighscore.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.canvasHighscore.className, 'high-score')
    const $canvasHighscore = document.querySelector('.high-score')
    assert.deepEqual($canvasHighscore, game.canvasHighscore)
})


test('Should assign data for canvasLeaderboard', () => {
    assert.deepEqual(game.canvasLeaderboard.constructor.name, 'HTMLDivElement')
    assert.deepEqual(game.canvasLeaderboard.className, 'leaderboard-hidden')
    const $canvasLeaderboard = document.querySelector('.leaderboard-hidden')
    assert.deepEqual($canvasLeaderboard, game.canvasLeaderboard)
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
    assert.deepEqual(game.canvasAlert.innerHTML, 'PRESS FIRE TO START GAME')
    assert.deepEqual(game.canvasLeaderboard.innerHTML, '')
})