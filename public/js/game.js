import { Spacetime } from './spacetime.js'
import { api } from './api.js'
import { chat } from './chat.js'
import { controls } from './controls.js'
import { leaderboard } from './leaderboard.js'
import { alert } from './alert.js'
import { highscore } from './highscore.js'
import { score } from './score.js'
import { lives } from './lives.js'

export const game = {
    level: 0,
    timeBetweenLevels: 3000,
    pointsForNewLife: 10000, 
    pause: false,
    seconds: 0,
    secondsBetweenSaucers: 15,
    probabilityCreateSaucerInitial: 0.3,
    probabilityCreateSaucer: 0.3,
    noSaucerPoints: 2000,
    largeSaucerPoints: 10000,
    randomSaucerPoints: 40000,
    isLevelStarting: false,
    pressFireTo: 'fire',
    audioTrack: 'background2.mp3',
    audioVolume: 0.3,
    openBoxes: 0,

    createGame(parentElement) {
        this.parentElement = parentElement

        this.initializeMainDiv()
        this.initializeCanvasScoreAndLives()
        this.initializeCustomEvents()
        this.initializeSpacetime()
        this.initializeAudio()

        score.initialize(this.canvasScoreAndLives)
        lives.initialize(this.canvasScoreAndLives)
        highscore.initialize(this.mainDiv)
        alert.initialize(this.mainDiv)
        leaderboard.initialize(this.mainDiv)
        controls.initialize()

        this.initializeGame()
    },

    initializeMainDiv() {
        this.mainDiv = document.createElement('div')
        this.mainDiv.id = 'spacetime'
        this.parentElement.appendChild(this.mainDiv)
    },

    initializeCanvasScoreAndLives() {
        this.canvasScoreAndLives = document.createElement('div')
        this.canvasScoreAndLives.className = 'score-and-lives'
        this.mainDiv.appendChild(this.canvasScoreAndLives)
    },

    initializeCustomEvents () {
        this.mainDiv.addEventListener('spaceshiphit', () => this.pressFireToPlayNewSpaceship())
        this.mainDiv.addEventListener('noasteroids', () => this.startLevel())

        this.mainDiv.addEventListener('onesecond', () => {
            this.seconds++
            if (this.seconds % this.secondsBetweenSaucers === 0) this.generateSaucer()
        })

        this.mainDiv.addEventListener('boxopen', () => {
            this.openBoxes++
            if (!game.pause && Spacetime.spaceship) this.switchPause()
        })

        this.mainDiv.addEventListener('boxclose', () => {
            this.openBoxes--
            if (this.openBoxes === 0 && this.pause) this.switchPause()
        })

        this.mainDiv.addEventListener('username', () => {
            const isLeaderboardVisible = this.pressFireTo === 'startgame'
            if (isLeaderboardVisible) leaderboard.refresh()
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
        this.level = 0
        this.seconds = 0
        this.probabilityCreateSaucer = this.probabilityCreateSaucerInitial

        alert.hide()
        leaderboard.hide()
        score.restart()
        lives.restart()
        highscore.restart()
        Spacetime.restart()

        this.playAudio()
        this.startLevel()

        chat.loginChatServer()
        chat.updateScore(0)
    },

    startLevel() {
        if (!Spacetime.spaceship && !lives.isLife()) return

        this.level++
        alert.show(`LEVEL ${this.level}`)    
        this.isLevelStarting = true

        setTimeout(() => {
            alert.hide()
            this.isLevelStarting = false
            Spacetime.createAsteroids(this.level + 1)
            if (!Spacetime.spaceship) this.pressFireToPlayNewSpaceship()
        }, this.timeBetweenLevels)
    },

    startSpaceship() {
        this.pressFireTo = 'fire'
        alert.hide() 
        lives.remove()
        Spacetime.createSpaceship()    
    },

    pressFireToPlayNewSpaceship() {
        if (!lives.isLife()) return this.gameOver()
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
        if (!Spacetime.spaceship || Spacetime.saucer) return
        if (this.pause || this.isLevelStarting) return
        if (Math.random() > this.probabilityCreateSaucer) return

        const small = 1, large = 2

        if (score.score < this.noSaucerPoints) return    
        else if (score.score < this.largeSaucerPoints) 
            Spacetime.createSaucer(large)
        else if (score.score < this.randomSaucerPoints) 
            Spacetime.createSaucer(Math.random() < 0.5 ? large : small)
        else 
            Spacetime.createSaucer(small)
    },

    extraLife() {
        lives.add()
        score.blink()
        chat.updateScore(score.score)
        this.increaseProbabilityCreateSaucer()
    },

    increaseProbabilityCreateSaucer() {
        this.probabilityCreateSaucer += (1 - this.probabilityCreateSaucer) / 5
    },

    switchPause() {
        if (!Spacetime.spaceship) return

        if (this.pause === false) {
            this.pause = true
            Spacetime.stop()
            this.stopAudio()
        } else if (this.openBoxes === 0) {
            this.pause = false
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