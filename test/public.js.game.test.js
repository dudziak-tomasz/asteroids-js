import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { Spacetime } from '../public/js/spacetime.js'
import { api } from '../public/js/api.js'
import { alert } from '../public/js/alert.js'
import { lives } from '../public/js/lives.js'
import { score } from '../public/js/score.js'
import { leaderboard } from '../public/js/leaderboard.js'
import { chat } from '../public/js/chat.js'
import { controls } from '../public/js/controls.js'
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


test('Should not generate saucer if is not spaceship', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = () => saucerMock = true
    Spacetime.spaceship = true
    Spacetime.saucer = false

    game.generateSaucer()
    assert.deepEqual(saucerMock, false)
})


test('Should not generate saucer if is saucer', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = () => saucerMock = true
    Spacetime.spaceship = true
    Spacetime.saucer = true

    game.generateSaucer()
    assert.deepEqual(saucerMock, false)
})


test('Should not generate saucer if game paused', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = () => saucerMock = true
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = true
    game.isLevelStarting = false

    game.generateSaucer()
    assert.deepEqual(saucerMock, false)
})


test('Should not generate saucer if level is starting', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = () => saucerMock = true
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = false
    game.isLevelStarting = true

    game.generateSaucer()
    assert.deepEqual(saucerMock, false)
})


test('Should not generate saucer if probability is too small', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = () => saucerMock = true
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = false
    game.isLevelStarting = false
    game.probabilityCreateSaucer = -1
    score.score = 3000

    game.generateSaucer()
    assert.deepEqual(saucerMock, false)
})


test('Should not generate saucer if score is too small', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = () => saucerMock = true
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = false
    game.isLevelStarting = false
    game.probabilityCreateSaucer = 1
    score.score = 1000

    game.generateSaucer()
    assert.deepEqual(saucerMock, false)
})


test('Should generate large saucer', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = (size) => saucerMock = size
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = false
    game.isLevelStarting = false
    game.probabilityCreateSaucer = 1
    score.score = 3000

    game.generateSaucer()
    assert.deepEqual(saucerMock, 2)
})


test('Should generate random size saucer', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = (size) => saucerMock = size
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = false
    game.isLevelStarting = false
    game.probabilityCreateSaucer = 1
    score.score = 11000

    game.generateSaucer()
    assert.deepEqual(saucerMock === 1 || saucerMock === 2, true)
})


test('Should generate small saucer', () => {
    // Prepare mocks
    let saucerMock = false
    Spacetime.createSaucer = (size) => saucerMock = size
    Spacetime.spaceship = true
    Spacetime.saucer = false
    game.pause = false
    game.isLevelStarting = false
    game.probabilityCreateSaucer = 1
    score.score = 41000

    game.generateSaucer()
    assert.deepEqual(saucerMock, 1)
})


test('Should increase probabilityCreateSaucer', () => {
    game.probabilityCreateSaucer = game.probabilityCreateSaucerInitial
    game.increaseProbabilityCreateSaucer()

    assert.deepEqual(game.probabilityCreateSaucer > game.probabilityCreateSaucerInitial, true)
})


test('Should add life, blink score, send chat.updateScore, increase probabilityCreateSaucer', () => {
    // Prepare mocks
    let livesAddMock = false
    lives.add = () => livesAddMock = true
    let scoreBlinkMock = false
    score.blink = () => scoreBlinkMock = true
    let chatUpdateScore = false
    chat.updateScore = () => chatUpdateScore = true

    game.probabilityCreateSaucer = game.probabilityCreateSaucerInitial
    game.extraLife()

    assert.deepEqual(livesAddMock, true)
    assert.deepEqual(scoreBlinkMock, true)
    assert.deepEqual(chatUpdateScore, true)
    assert.deepEqual(game.probabilityCreateSaucer > game.probabilityCreateSaucerInitial, true)
})


test('Should not switch game.pause', () => {
    // Prepare mocks
    game.pause = false
    Spacetime.spaceship = undefined

    game.switchPause()
    assert.deepEqual(game.pause, false)
})


test('Should switch game.pause from false to true', () => {
    // Prepare mocks
    game.pause = false
    Spacetime.spaceship = true
    game.playAudio()
    let spacetimeStopMock = false
    Spacetime.stop = () => spacetimeStopMock = true

    assert.deepEqual(game.audio.isPlaying, true)
    game.switchPause()
    assert.deepEqual(game.pause, true)
    assert.deepEqual(spacetimeStopMock, true)
    assert.deepEqual(game.audio.isPlaying, false)
})


test('Should switch game.pause from true to false', () => {
    // Prepare mocks
    game.pause = true
    Spacetime.spaceship = {
        stopFire: () => 0,
        stopRotation: () => 0,
        stopAccelerate: () => 0
    }
    game.stopAudio()
    game.openBoxes = 0
    let spacetimeStartMock = false
    Spacetime.start = () => spacetimeStartMock = true

    assert.deepEqual(game.audio.isPlaying, false)
    game.switchPause()
    assert.deepEqual(game.pause, false)
    assert.deepEqual(spacetimeStartMock, true)
    assert.deepEqual(game.audio.isPlaying, true)
})



test('Should not switch game.pause from true to false when there are open boxes', () => {
    // Prepare mocks
    game.pause = true
    Spacetime.spaceship = {
        stopFire: () => 0,
        stopRotation: () => 0,
        stopAccelerate: () => 0
    }
    game.stopAudio()
    game.openBoxes = 1
    let spacetimeStartMock = false
    Spacetime.start = () => spacetimeStartMock = true

    assert.deepEqual(game.audio.isPlaying, false)
    game.switchPause()
    assert.deepEqual(game.pause, true)
    assert.deepEqual(spacetimeStartMock, false)
    assert.deepEqual(game.audio.isPlaying, false)
})


test('Should listen for spaceshiphit event', () => {
    // Prepare mocks
    let pressFireToPlayNewSpaceshipMock = false
    game.pressFireToPlayNewSpaceship = () => pressFireToPlayNewSpaceshipMock = true
  
    game.mainDiv.dispatchEvent(new CustomEvent('spaceshiphit'))
    assert.deepEqual(pressFireToPlayNewSpaceshipMock, true)
})


test('Should listen for noasteroids event', () => {
    // Prepare mocks
    let startLevelMock = false
    game.startLevel = () => startLevelMock = true

    game.mainDiv.dispatchEvent(new CustomEvent('noasteroids'))
    assert.deepEqual(startLevelMock, true)
})


test('Should listen for onesecond event', () => {
    // Prepare mocks
    let generateSaucerMock = false
    game.generateSaucer = () => generateSaucerMock = true

    game.seconds = game.secondsBetweenSaucers - 1
    game.mainDiv.dispatchEvent(new CustomEvent('onesecond'))
    assert.deepEqual(game.seconds, game.secondsBetweenSaucers)
    assert.deepEqual(generateSaucerMock, true)
})


test('Should listen for boxopen event', () => {
    // Prepare mocks
    let switchPauseMock = false
    game.switchPause = () => switchPauseMock = true

    game.openBoxes = 0
    game.pause = false
    Spacetime.spaceship = true
    game.mainDiv.dispatchEvent(new CustomEvent('boxopen'))
    assert.deepEqual(game.openBoxes, 1)
    assert.deepEqual(switchPauseMock, true)
})


test('Should listen for boxclose event', () => {
    // Prepare mocks
    let switchPauseMock = false
    game.switchPause = () => switchPauseMock = true

    game.openBoxes = 1
    game.pause = true
    game.mainDiv.dispatchEvent(new CustomEvent('boxclose'))
    assert.deepEqual(game.openBoxes, 0)
    assert.deepEqual(switchPauseMock, true)
})


test('Should listen for username event', () => {
    // Prepare mocks
    let leaderboardRefreshMock = false
    leaderboard.refresh = () => leaderboardRefreshMock = true

    game.pressFireTo = 'startgame'
    game.mainDiv.dispatchEvent(new CustomEvent('username'))
    assert.deepEqual(leaderboardRefreshMock, true)
})


test('Should call pressFireIfNoSpaceship from checkControls', () => {
    // Prepare mocks
    let pressFireIfNoSpaceshipMock = false
    game.pressFireIfNoSpaceship = () => pressFireIfNoSpaceshipMock = true
    game.openBoxes = 0
    game.pause = false
    Spacetime.spaceship = false
    controls.fire = ['keyboard']

    game.checkControls()
    assert.deepEqual(pressFireIfNoSpaceshipMock, true)

})


test('Should return from checkControls if there are open boxes', () => {
    // Prepare mocks
    let pressFireIfNoSpaceshipMock = false
    game.pressFireIfNoSpaceship = () => pressFireIfNoSpaceshipMock = true
    game.openBoxes = 1
    game.pause = false
    Spacetime.spaceship = false
    controls.fire = ['keyboard']

    game.checkControls()
    assert.deepEqual(pressFireIfNoSpaceshipMock, false)
})


test('Should return from checkControls if game is paused', () => {
    // Prepare mocks
    let pressFireIfNoSpaceshipMock = false
    game.pressFireIfNoSpaceship = () => pressFireIfNoSpaceshipMock = true
    game.openBoxes = 0
    game.pause = true
    Spacetime.spaceship = false
    controls.fire = ['keyboard']

    game.checkControls()
    assert.deepEqual(pressFireIfNoSpaceshipMock, false)
})


test('Should call Spacetime.spaceship.startHyperspace from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = ['keyboard']
    controls.fire = []
    controls.rotation = []
    controls.accelerate = false
    let startMock = false
    Spacetime.spaceship = {
        startHyperspace: () => startMock = true,
        stopFire: () => 0,
        stopRotation: () => 0,
        stopAccelerate: () => 0,
    }

    game.checkControls()
    assert.deepEqual(startMock, true)
})


test('Should call Spacetime.spaceship.startFire from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = []
    controls.fire = ['keyboard']
    controls.rotation = []
    controls.accelerate = false
    let startMock = false
    Spacetime.spaceship = {
        startFire: () => startMock = true,
        stopRotation: () => 0,
        stopAccelerate: () => 0,
    }

    game.checkControls()
    assert.deepEqual(startMock, true)
})


test('Should call Spacetime.spaceship.startRotation from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = []
    controls.fire = []
    controls.rotation = ['left']
    controls.accelerate = false
    let startMock = false
    Spacetime.spaceship = {
        stopFire: () => 0,
        startRotation: (direction) => startMock = direction,
        stopAccelerate: () => 0,
    }

    game.checkControls()
    assert.deepEqual(startMock, 'left')
})


test('Should call Spacetime.spaceship.startAccelerate from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = []
    controls.fire = []
    controls.rotation = []
    controls.accelerate = true
    let startMock = false
    Spacetime.spaceship = {
        stopFire: () => 0,
        stopRotation: () => 0,
        startAccelerate: () => startMock = true,
    }

    game.checkControls()
    assert.deepEqual(startMock, true)
})


test('Should call Spacetime.spaceship.stopFire from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = []
    controls.fire = []
    controls.rotation = []
    controls.accelerate = false
    let stopMock = false
    Spacetime.spaceship = {
        stopFire: () => stopMock = true,
        stopRotation: () => 0,
        stopAccelerate: () => 0,
    }

    game.checkControls()
    assert.deepEqual(stopMock, true)
})


test('Should call Spacetime.spaceship.stopRotation from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = []
    controls.fire = []
    controls.rotation = []
    controls.accelerate = false
    let stopMock = false
    Spacetime.spaceship = {
        stopFire: () => 0,
        stopRotation: () => stopMock = true,
        stopAccelerate: () => 0,
    }

    game.checkControls()
    assert.deepEqual(stopMock, true)
})


test('Should call Spacetime.spaceship.stopAccelerate from checkControls', () => {
    // Prepare mocks
    game.openBoxes = 0
    game.pause = false
    controls.hyperspace = []
    controls.fire = []
    controls.rotation = []
    controls.accelerate = false
    let stopMock = false
    Spacetime.spaceship = {
        stopFire: () => 0,
        stopRotation: () => 0,
        stopAccelerate: () => stopMock = true,
    }

    game.checkControls()
    assert.deepEqual(stopMock, true)
})


