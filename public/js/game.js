import { Spacetime } from './spacetime.js'
import { Spaceship } from './spaceship.js'
import { api } from './api.js'
import { chat } from './chat.js'
import { controls } from './controls.js'
import { leaderboard } from './leaderboard.js'
import { alert } from './alert.js'
import { highscore } from './highscore.js'
import { score } from './score.js'

export const game = {

    level: 0,
    seconds: 0,
    pointsForAsteroids: [0, 100, 50, 20],
    pointsForSaucers: [0, 1000, 200],
    pointsForNewLife: 10000, 
    lives: [],
    numberOfLives: 3,
    pause: false,
    timeBetweenLevels: 3000,
    timeBetweenSaucers: 15,
    probabilityCreateSaucerInit: 0.3,
    probabilityCreateSaucer: 0.3,
    typeOfSaucer: [2000, 10000, 40000],   // 0 < no saucer - 2000 < large saucer - 10000 < random size saucer < 40000 < small saucer
    isLevelStarting: false,
    pressFireTo: 'fire',
    audioTrack: 'background2.mp3',
    audioVolume: 0.3,
    openBoxes: 0,

    createGame(parentElement) {
        this.parentElement = parentElement

        this.initializeMainDiv()
        this.initializeCanvasScoreAndLives()

        highscore.initialize(this.mainDiv)
        alert.initialize(this.mainDiv)
        leaderboard.initialize(this.mainDiv)

        this.initializeCustomEvents()
        this.initializeSpacetime()
        this.initializeAudio()
        this.initializeGame()

        controls.initialize()
    },

    initializeMainDiv() {
        this.mainDiv = document.createElement('div')
        this.mainDiv.id = 'spacetime'
        this.parentElement.appendChild(this.mainDiv)
    },

    initializeCanvasScoreAndLives() {
        this.canvasScoreAndLives = document.createElement('div')
        this.canvasScoreAndLives.className = 'score-and-lives'

        score.initialize(this.canvasScoreAndLives)
        
        this.canvasLives = document.createElement('div')
        this.canvasScoreAndLives.appendChild(this.canvasLives)

        this.mainDiv.appendChild(this.canvasScoreAndLives)
    },

    initializeCustomEvents () {
        this.mainDiv.addEventListener('asteroidhit', (e) => {
            score.addPoints(this.pointsForAsteroids[e.detail.size])
        })

        this.mainDiv.addEventListener('saucerhit', (e) => {
            score.addPoints(this.pointsForSaucers[e.detail.size])
        })

        this.mainDiv.addEventListener('spaceshiphit', () => {
            this.newSpaceship()
        })

        this.mainDiv.addEventListener('noasteroids', () => {
            this.startLevel()
        })

        this.mainDiv.addEventListener('onesecond', () => {
            this.seconds++
            if (this.seconds % this.timeBetweenSaucers === 0) this.generateSaucer()
        })

        this.mainDiv.addEventListener('boxopen', () => {
            this.openBoxes++
            if (!game.pause && Spacetime.spaceship) this.switchPause()
        })

        this.mainDiv.addEventListener('boxclose', () => {
            this.openBoxes--
            if (this.openBoxes === 0 && game.pause) this.switchPause()
        })

        this.mainDiv.addEventListener('username', () => {
            const isLeaderboardVisible = this.pressFireTo === 'startgame'
            if (isLeaderboardVisible) leaderboard.show()
        })

    },

    initializeSpacetime() {
        Spacetime.createSpacetime(this.mainDiv)
        Spacetime.createAsteroids(2,3)
        Spacetime.createAsteroids(2,2)
        Spacetime.createAsteroids(3,1)
    },

    initializeAudio() {
        this.audio = new Audio()
        this.audio.loop = true
        this.getAudioTrack()
        this.getAudioVolume()
    },

    initializeGame() {
        this.pressFireTo = 'startgame'
        alert.show('PRESS FIRE TO START GAME')
        leaderboard.show()
    },

    getAudioTrack() {
        const track = localStorage.getItem('audioTrack')
        if (track) this.audioTrack = track
        else this.setAudioTrack()

        this.audio.src = `/audio/${this.audioTrack}`
        return this.audioTrack
    },

    setAudioTrack(track) {
        if (track !== undefined) this.audioTrack = track
        localStorage.setItem('audioTrack', this.audioTrack)
        this.audio.src = `/audio/${this.audioTrack}`
    },

    getAudioVolume() {
        const volume = localStorage.getItem('musicVolume')
        if (volume) this.audioVolume = parseFloat(volume)
        else this.setAudioVolume()

        this.audio.volume = this.audioVolume
        return this.audioVolume
    },

    setAudioVolume(volume) {
        if (volume !== undefined) this.audioVolume = volume
        localStorage.setItem('musicVolume', this.audioVolume)
        this.audio.volume = this.audioVolume
    },

    playAudio() {
        if (this.audioVolume === 0) return
        this.audio.play()
    },

    stopAudio() {
        this.audio.pause()
    },

    pressFireIfNoSpaceship() {
        if (this.pressFireTo === 'initializegame') this.initializeGame()
        else if (this.pressFireTo === 'startgame') this.startGame()
        else if (this.pressFireTo === 'startspaceship') this.startSpaceship()
    },

    startGame() {
        this.pressFireTo = 'fire'
        alert.hide()
        leaderboard.hide()

        this.level = 0
        this.seconds = 0
        this.probabilityCreateSaucer = this.probabilityCreateSaucerInit

        score.setAndRefresh(0)

        this.initializeLives()
        this.refreshLives()

        highscore.achieved = false
        highscore.getAndRefresh()

        this.playAudio()

        Spacetime.removeAllAsteroid()

        this.startLevel()

        chat.loginChatServer()
        chat.updateScore(0)
    },

    startLevel() {
        const noSpaceshipAndNoExtraLives = !Spacetime.spaceship && this.lives.length === 0
        if ( noSpaceshipAndNoExtraLives ) return

        this.level++
        alert.show(`LEVEL ${this.level}`)    
        this.isLevelStarting = true

        setTimeout(() => {
            alert.hide()
            this.isLevelStarting = false
            Spacetime.createAsteroids(this.level + 1)
            if (!Spacetime.spaceship) this.newSpaceship()
        }, this.timeBetweenLevels)
    },

    startSpaceship() {
        this.pressFireTo = 'fire'
        alert.hide() 

        this.lives.shift().canvas.remove()
        this.refreshLives()
        Spacetime.createSpaceship()    
    },

    newSpaceship() {
        if (this.lives.length === 0) return this.gameOver()
        if (this.isLevelStarting) return

        alert.show('PRESS FIRE TO PLAY')
        this.pressFireTo = 'startspaceship'
    },

    gameOver() {
        alert.show('GAME OVER')
        this.pressFireTo = 'initializegame'
        if (api.user) api.updateUser()
    },

    generateSaucer() {
        if (!Spacetime.spaceship || Spacetime.saucer || this.pause || this.isLevelStarting || this.score < this.typeOfSaucer[0]) return

        if (score.score < this.typeOfSaucer[1]) this.createSaucer(2)
        else if (score.score < this.typeOfSaucer[2]) Math.random() < 0.5 ? this.createSaucer(1) : this.createSaucer(2)
        else this.createSaucer(1)
    },

    createSaucer(size) {
        if (Math.random() < this.probabilityCreateSaucer) Spacetime.createSaucer(size)
    },

    extraLife() {
        this.addLives()
        this.refreshLives()
        score.blink()

        this.probabilityCreateSaucer += (1 - this.probabilityCreateSaucer) / 5
    },

    initializeLives() {
        for (let i = 0; i < this.numberOfLives; i++) this.addLives()
    },

    addLives() {
        const color = getComputedStyle(this.canvasScoreAndLives).getPropertyValue('--gray') || 'white'
        this.lives.push(new Spaceship({ size: 0.6, position: 'static', color }))
    },

    refreshLives() {
        this.canvasLives.innerHTML = ''
        for (let i = 0; i < this.lives.length; i++) {
            this.canvasLives.appendChild(this.lives[i].canvas)
        }
    },

    switchPause() {
        if (!Spacetime.spaceship) return

        if (game.pause === false) {
            game.pause = true
            Spacetime.stop()
            this.stopAudio()
        } else if (this.openBoxes === 0) {
            game.pause = false
            Spacetime.start()
            this.playAudio()
            this.checkControls()    
        }
    },

    checkControls() {
        if (this.openBoxes > 0 || this.pause) return
        
        if (!Spacetime.spaceship) {            
            if (controls.isFire()) this.pressFireIfNoSpaceship()
            return
        }

        if (controls.isHyperspace()) Spacetime.spaceship.startHyperspace()

        if (controls.isFire()) Spacetime.spaceship.startFire()
        else Spacetime.spaceship.stopFire()

        if (controls.isRotation()) Spacetime.spaceship.startRotation(controls.rotationDirection())
        else Spacetime.spaceship.stopRotation()

        if (controls.isAccelerate()) Spacetime.spaceship.startAccelerate() 
        else Spacetime.spaceship.stopAccelerate()
    },

}