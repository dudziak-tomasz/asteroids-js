import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { Spacetime } from '../public/js/spacetime.js'
import { api } from '../public/js/api.js'
import { alert } from '../public/js/alert.js'
import { lives } from '../public/js/lives.js'
import { leaderboard } from '../public/js/leaderboard.js'
import { chat } from '../public/js/chat.js'
import { sleep } from './__mocks__/mock.sleep.js'
import { game } from '../public/js/game.js'


test('Should set default data', () => {
    assert.deepEqual(game.level, 0)
    assert.deepEqual(game.timeBetweenLevels, 3000)
    assert.deepEqual(game.pointsForNewLife, 10000)
    assert.deepEqual(game.pause, false)
    assert.deepEqual(game.seconds, 0)
    assert.deepEqual(game.secondsBetweenSaucers, 15)
    assert.deepEqual(game.probabilityCreateSaucerInitial, 0.3)
    assert.deepEqual(game.probabilityCreateSaucer, 0.3)
    assert.deepEqual(game.noSaucerPoints, 2000)
    assert.deepEqual(game.largeSaucerPoints, 10000)
    assert.deepEqual(game.randomSaucerPoints, 40000)
    assert.deepEqual(game.isLevelStarting, false)
    assert.deepEqual(game.pressFireTo, 'fire')
    assert.deepEqual(game.audioTrack, 'background2.mp3')
    assert.deepEqual(game.audioVolume, 0.3)
    assert.deepEqual(game.openBoxes, 0)
})


test('Should create parentElement for game objects', () => {
    game.createGame(document.body)
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


test('Should assign default data for background audio', () => {
    assert.deepEqual(game.audioTrack, 'background2.mp3')
    assert.deepEqual(game.audioVolume, 0.3)
    assert.ok(game.audio)
    assert.deepEqual(game.audio.loop, true)
    assert.deepEqual(game.audio.src, '/audio/background2.mp3')
    assert.deepEqual(game.audio.isPlaying, false)
})


test('Should assign data for state of game', () => {
    // Prepare mocks
    let showMock = false
    leaderboard.show = () => showMock = true

    game.initializeGame()
    assert.deepEqual(game.pressFireTo, 'startgame')
    assert.deepEqual(alert.canvas.className, 'alert')
    assert.deepEqual(alert.canvas.innerHTML, 'PRESS FIRE TO START GAME')
    assert.deepEqual(showMock, true)
})


test('Should get audio track from localStorage', () => {
    // Prepare mocks
    localStorage.setItem('audioTrack', 'test.mp3')

    const audioTrack = game.getAudioTrack()
    assert.deepEqual(game.audioTrack, 'test.mp3')
    assert.deepEqual(audioTrack, 'test.mp3')
    assert.deepEqual(game.audio.src, '/audio/test.mp3')
})


test('Should set given audio track', () => {
    game.setAudioTrack('testing.mp3')
    const audioTrack = localStorage.getItem('audioTrack')

    assert.deepEqual(game.audioTrack, 'testing.mp3')
    assert.deepEqual(game.audio.src, '/audio/testing.mp3')
    assert.deepEqual(audioTrack, 'testing.mp3')
})


test('Should get audio volume from localStorage', () => {
    // Prepare mocks
    localStorage.setItem('musicVolume', '0.8')

    const audioVolume = game.getAudioVolume()
    assert.deepEqual(game.audioVolume, 0.8)
    assert.deepEqual(audioVolume, 0.8)
    assert.deepEqual(game.audio.volume, 0.8)
})


test('Should set given audio volume', () => {
    game.setAudioVolume(0.1)

    const audioVolume = localStorage.getItem('musicVolume')
    assert.deepEqual(game.audioVolume, 0.1)
    assert.deepEqual(audioVolume, 0.1)
    assert.deepEqual(game.audio.volume, 0.1)
})


test('Should play background audio', () => {
    game.audio.isPlaying = false
    game.playAudio()
    assert.deepEqual(game.audio.isPlaying, true)
})


test('Should not play background audio', () => {
    game.audioVolume = 0
    game.audio.isPlaying = false
    game.playAudio()
    assert.deepEqual(game.audio.isPlaying, false)
})


test('Should stop playing background audio', () => {
    game.setAudioVolume(0.1)
    game.playAudio()
    assert.deepEqual(game.audio.isPlaying, true)
    game.stopAudio()
    assert.deepEqual(game.audio.isPlaying, false)
})


test('Should start new game and reset data', async () => {
    // Prepare mocks
    chat.loginChatServer = () => 0
    chat.updateScore = () => 0
    game.timeBetweenLevels = 5

    game.startGame()

    assert.deepEqual(game.pressFireTo, 'fire')
    assert.deepEqual(game.level, 1)
    assert.deepEqual(game.seconds, 0)
    assert.deepEqual(game.probabilityCreateSaucer, 0.3)
    assert.deepEqual(game.audio.isPlaying, true)
  
    await sleep(10)
})


test('Should start level', async () => {
    // Prepare mocks
    game.timeBetweenLevels = 5
    game.level = 0
    Spacetime.restart()

    game.startLevel()
    assert.deepEqual(game.level, 1)
    assert.deepEqual(alert.canvas.className, 'alert')

    await sleep(10)

    assert.deepEqual(game.isLevelStarting, false)
    assert.deepEqual(Spacetime.asteroids.size, 2)
})


test('Should not start level', () => {
    // Prepare mocks
    lives.lives = []
    Spacetime.spaceship = undefined
    game.level = 0

    game.startLevel()
    assert.deepEqual(game.level, 0)
})


test('Should start spaceship', () => {
    // Prepare mocks
    lives.restart()

    game.startSpaceship()
    assert.deepEqual(game.pressFireTo, 'fire')
    assert.deepEqual(alert.canvas.className, 'alert-hidden')
    assert.deepEqual(lives.lives.length, 2)
    assert.notDeepEqual(Spacetime.spaceship, undefined)
})


test('Should prepare for new spaceship', () => {
    // Prepare mocks
    lives.restart()

    game.pressFireToPlayNewSpaceship()
    assert.deepEqual(alert.canvas.className, 'alert')
    assert.deepEqual(alert.canvas.innerHTML, 'PRESS FIRE TO PLAY')
    assert.deepEqual(game.pressFireTo, 'startspaceship')
})


test('Should not prepare for new spaceship', () => {
    // Prepare mocks
    game.isLevelStarting = true
    game.pressFireTo = 'fire'

    game.pressFireToPlayNewSpaceship()
    assert.deepEqual(game.pressFireTo, 'fire')
})


test('Should set data for game over', () => {
    // Prepare mocks
    let updateUserMock = false
    api.user = {}
    api.updateUser = () => updateUserMock = true

    game.gameOver()
    assert.deepEqual(alert.canvas.innerHTML, 'GAME OVER')
    assert.deepEqual(game.pressFireTo, 'initializegame')
    assert.deepEqual(updateUserMock, true)
})


test('Should not prepare for new spaceship and call gameOver', () => {
    // Prepare mocks
    lives.lives = []

    game.pressFireToPlayNewSpaceship()
    assert.deepEqual(game.pressFireTo, 'initializegame')
})


test('Should call initializeGame from PressFireIfNoSpaceship', () => {
    //Prepare mocks
    game.pressFireTo = 'initializegame'

    game.pressFireIfNoSpaceship()
    assert.deepEqual(game.pressFireTo, 'startgame')
})


test('Should call startGame from PressFireIfNoSpaceship', () => {
    //Prepare mocks
    game.pressFireTo = 'startgame'
    api.user = undefined

    game.pressFireIfNoSpaceship()
    assert.deepEqual(game.level, 1)
})


test('Should call startSpaceship from PressFireIfNoSpaceship', () => {
    //Prepare mocks
    game.pressFireTo = 'startspaceship'

    game.pressFireIfNoSpaceship()
    assert.notDeepEqual(Spacetime.spaceship, undefined)
})




test('Should listen for custom events', {todo: true}, () => {

})