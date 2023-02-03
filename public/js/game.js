import { Spacetime } from './spacetime.js'
import { Spaceship } from './spaceship.js'
import { api } from './api.js'
import { chat } from './chat.js'

export const game = {
    level: 0,
    score: 0,
    highscore: 0,
    seconds: 0,
    highscoreAchieved: false,
    scoreForAsteroids: [0, 100, 50, 20],
    scoreForSaucers: [0, 1000, 200],
    scoreForNewLife: 10000, 
    lives: [],
    numberOfLives: 3,
    pause: false,
    rotation: [],
    accelerate: false,
    fire: [],
    hyperspace: [],
    timeBetweenLevels: 3000,
    timeBlinkScore: 1000,
    timeBetweenSaucers: 15,
    probabilityCreateSaucerInit: 0.3,
    probabilityCreateSaucer: 0.3,
    typeOfSaucer: [2000, 10000, 40000],   // 0 < no saucer - 2000 < large saucer - 10000 < random size saucer < 40000 < small saucer
    isLevelStarting: false,
    pressFireTo: 'fire',
    isTouch: false,
    audioTrack: 'background2.mp3',
    audioVolume: 0.3,
    openBoxes: 0,

    createGame(parentElement) {
        this.parentElement = parentElement

        this.initializeMainDiv()
        this.initializeCanvasAlert()
        this.initializeCanvasScore()
        this.initializeCanvasHighscore()
        this.initializeCanvasLeaderboard()

        this.initializeScoreAndHighscore()

        this.initializeEvents()
        this.initializeCustomEvents()

        this.initializeSpacetime()

        this.initializeAudio()

        this.initializeGame()
    },

    initializeMainDiv() {
        this.mainDiv = document.createElement('div')
        this.mainDiv.id = 'spacetime'
        this.mainDiv.style.position = 'fixed'
        this.mainDiv.style.width = '100vw'
        this.mainDiv.style.height = '100vh'
        this.mainDiv.style.backgroundColor = 'black'
        this.mainDiv.style.top = '0'
        this.mainDiv.style.left = '0'
        this.parentElement.appendChild(this.mainDiv)
    },

    initializeCanvasAlert() {
        this.canvasAlert = document.createElement('div')
        this.canvasAlert.className = 'alert'
        this.mainDiv.appendChild(this.canvasAlert)    
    },

    initializeCanvasScore() {
        this.canvasScore = document.createElement('div')
        this.canvasScore.className = 'score'
        this.mainDiv.appendChild(this.canvasScore)    
    },

    initializeCanvasHighscore() {
        this.canvasHighscore = document.createElement('div')
        this.canvasHighscore.className = 'high-score'
        this.mainDiv.appendChild(this.canvasHighscore)    
    },

    initializeCanvasLeaderboard() {
        this.canvasLeaderboard = document.createElement('div')
        this.canvasLeaderboard.className = 'leaderboard-hidden'
        this.mainDiv.appendChild(this.canvasLeaderboard)    
    },

    initializeScoreAndHighscore() {
        this.refreshScore()
        this.getHighscore()
        this.refreshHighscore()
    },

    initializeEvents() {
        this.parentElement.addEventListener('keydown', (event) => this.eventKeyDown(event))
        this.parentElement.addEventListener('keyup', (event) => this.eventKeyUp(event))
    
        this.mainDiv.addEventListener('mousedown', (event) => this.eventMouseDown(event))
        this.mainDiv.addEventListener('mouseup', (event) => this.eventMouseUp(event))

        this.mainDiv.addEventListener('touchstart', (event) => this.eventTouchStart(event))
        this.mainDiv.addEventListener('touchmove', (event) => this.eventTouchMove(event))
        this.mainDiv.addEventListener('touchend', (event) => this.eventTouchEnd(event))
    },

    initializeCustomEvents () {
        this.mainDiv.addEventListener('asteroidhit', (e) => {
            this.addPoints(this.scoreForAsteroids[e.detail.size])
        })

        this.mainDiv.addEventListener('saucerhit', (e) => {
            this.addPoints(this.scoreForSaucers[e.detail.size])
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

        this.mainDiv.addEventListener('login', () => {
            this.getHighscore()
            this.refreshHighscore()
        })

        this.mainDiv.addEventListener('logout', () => {
            this.getHighscore()
            this.refreshHighscore()
        })

        this.mainDiv.addEventListener('username', () => {
            this.getHighscore()
            this.refreshHighscore()
            if (this.pressFireTo === 'startgame') this.showLeaderboard()
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
        this.showAlert('PRESS FIRE TO START GAME')
        this.showLeaderboard()
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

    async showLeaderboard() {
        if (this.pressFireTo !== 'startgame' && this.pressFireTo !== 'initializegame') return

        this.leaderboard = await api.getLeaderboard()
        if (!this.leaderboard) return

        let innerHTML = '<table class="leaderboard-table">'

        this.leaderboard.forEach((leader) => innerHTML += `
            <tr>
            <td class="leader-score box-light-gray">${leader.highscore}</td>
            <td class="leader-name">${leader.username.toUpperCase()}</td>
            </tr>
        `)

        innerHTML += '</table>'
        this.canvasLeaderboard.innerHTML = innerHTML
        this.canvasLeaderboard.className = 'leaderboard'    
    },

    hideLeaderboard() {
        this.canvasLeaderboard.className = 'leaderboard-hidden'
    },

    pressFireIfNoSpaceship() {
        if (this.pressFireTo === 'initializegame') this.initializeGame()
        else if (this.pressFireTo === 'startgame') this.startGame()
        else if (this.pressFireTo === 'startspaceship') this.startSpaceship()
    },

    startGame() {
        this.pressFireTo = 'fire'
        this.hideAlert()
        this.hideLeaderboard()

        this.level = 0
        this.score = 0
        this.seconds = 0
        this.probabilityCreateSaucer = this.probabilityCreateSaucerInit

        this.initializeLives()
        this.refreshScore()

        this.highscoreAchieved = false
        this.getHighscore()
        this.refreshHighscore()

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
        this.showAlert(`LEVEL ${this.level}`)    
        this.isLevelStarting = true

        setTimeout(() => {
            this.hideAlert()
            this.isLevelStarting = false
            Spacetime.createAsteroids(this.level + 1)
            if (!Spacetime.spaceship) this.newSpaceship()
        }, this.timeBetweenLevels)
    },

    startSpaceship() {
        this.pressFireTo = 'fire'
        this.hideAlert() 

        this.lives.shift().canvas.remove()
        this.refreshScore()
        Spacetime.createSpaceship()    
    },

    newSpaceship() {
        if (this.lives.length === 0) return this.gameOver()
        if (this.isLevelStarting) return

        this.showAlert('PRESS FIRE TO PLAY')
        this.pressFireTo = 'startspaceship'
    },

    gameOver() {
        this.showAlert('GAME OVER')
        this.pressFireTo = 'initializegame'

        if (api.user) api.updateUser()
    },

    generateSaucer() {
        if (!Spacetime.spaceship || Spacetime.saucer || this.pause || this.isLevelStarting || this.score < this.typeOfSaucer[0]) return

        if (this.score < this.typeOfSaucer[1]) this.createSaucer(2)
        else if (this.score < this.typeOfSaucer[2]) Math.random() < 0.5 ? this.createSaucer(1) : this.createSaucer(2)
        else this.createSaucer(1)
    },

    createSaucer(size) {
        if (Math.random() < this.probabilityCreateSaucer) Spacetime.createSaucer(size)
    },

    extraLife() {
        this.addLives()
        this.blinkScore()

        this.probabilityCreateSaucer += (1 - this.probabilityCreateSaucer) / 5
    },

    addPoints(points) {
        const newScore = this.score + points
        if (Math.trunc(this.score / this.scoreForNewLife) < Math.trunc(newScore / this.scoreForNewLife)) {
            this.extraLife()
            chat.updateScore(newScore)
        }
        this.score = newScore
        this.refreshScore()
    },

    initializeLives() {
        for (let i = 0; i < this.numberOfLives; i++) {
            this.addLives()
        }
    },

    addLives() {
        const color = getComputedStyle(this.canvasScore).getPropertyValue('--gray') || 'white'
        this.lives.push(new Spaceship({ size: 0.6, position: 'static', color }))
    },

    refreshScore() {
        this.canvasScore.innerHTML = `${this.score}<br>`
        for (let i = 0; i < this.lives.length; i++) {
            this.canvasScore.appendChild(this.lives[i].canvas)
        }

        if (this.score <= this.highscore) return 

        this.highscore = this.score
        this.refreshHighscore()
        this.setHighscore()

        if (this.highscoreAchieved) return 

        this.blinkScore()
        this.highscoreAchieved = true    
    },

    blinkScore() {
        this.canvasScore.className = 'score-blink'
        setTimeout(() => {
            this.canvasScore.className = 'score'
        }, this.timeBlinkScore)
    },

    refreshHighscore() {
        this.canvasHighscore.innerHTML = `${this.highscore} ${api.user ? api.user.username.toUpperCase() : ''}`
    },

    getHighscore() {
        if (api.user) return this.highscore = api.user.highscore

        const hs = localStorage.getItem('highScore')
        if (hs) this.highscore = parseInt(hs)
        else this.setHighscore()    
    },

    setHighscore() {
        if (api.user) return api.user.highscore = this.highscore

        localStorage.setItem('highScore', this.highscore)
    },

    showAlert(alertHTML) {
        this.canvasAlert.innerHTML = alertHTML
        this.canvasAlert.className = 'alert'
    },

    hideAlert() {
        this.canvasAlert.className = 'alert-hidden'
    },

    switchPause() {
        if (!Spacetime.spaceship) return

        if (!game.pause) {
            Spacetime.stop()
            this.stopAudio()
            game.pause = !game.pause
        } else if (this.openBoxes === 0) {
            Spacetime.start()
            this.playAudio()
            this.checkSwitches()    
            game.pause = !game.pause
        }
    },

    checkSwitches() {
        if (this.openBoxes > 0) return
        
        if (!Spacetime.spaceship) {            
            if (this.fire.length > 0) this.pressFireIfNoSpaceship()
            return
        }

        this.hyperspace.length > 0 ? Spacetime.spaceship.startHyperspace() : 0
        this.fire.length > 0 ? Spacetime.spaceship.startFire() : Spacetime.spaceship.stopFire()
        this.rotation.length > 0 ? Spacetime.spaceship.startRotation(this.rotation[0]) : Spacetime.spaceship.stopRotation()
        this.accelerate ? Spacetime.spaceship.startAccelerate() : Spacetime.spaceship.stopAccelerate()
    },

    eventKeyDown(event) {
        switch(event.code) {
            case 'KeyP':
                this.switchPause()
                break
            case 'KeyA':
            case 'ArrowLeft':
                if (!this.rotation.includes('left')) this.rotation.unshift('left')
                break
            case 'KeyD':
            case 'ArrowRight':
                if (!this.rotation.includes('right')) this.rotation.unshift('right')
                break
            case 'KeyW':
            case 'ArrowUp':
                this.accelerate = true
                break
            case 'Space':
                if (!this.fire.includes('keyboard')) this.fire.unshift('keyboard')
                break
            case 'KeyH':
                if (!this.hyperspace.includes('keyboard')) this.hyperspace.unshift('keyboard')
                break
        }        

        if (!this.pause) this.checkSwitches()
    },

    eventKeyUp(event) {
        switch(event.code) {
            case 'KeyA':
            case 'ArrowLeft':
                const indexLeft = this.rotation.findIndex(r => r === 'left')
                this.rotation.splice(indexLeft, 1)
                break
            case 'KeyD':
            case 'ArrowRight':
                const indexRight = this.rotation.findIndex(r => r === 'right')
                this.rotation.splice(indexRight, 1)
                break
            case 'KeyW':
            case 'ArrowUp':
                this.accelerate = false
                break
            case 'Space':
                const indexFire = this.fire.findIndex(f => f === 'keyboard')
                this.fire.splice(indexFire, 1)
                break
            case 'KeyH':
                const indexHyperspace = this.hyperspace.findIndex(h => h === 'keyboard')
                this.hyperspace.splice(indexHyperspace, 1)
                break
        }    

        if (!this.pause) this.checkSwitches()
    },

    eventMouseDown(event) {
        if (this.isTouch) return

        switch(event.button) {
            case 0:
                if (!this.fire.includes('mouse')) this.fire.unshift('mouse')
                break
            case 2:
                if (!this.hyperspace.includes('mouse')) this.hyperspace.unshift('mouse')
                break
        }
        
        if (!this.pause) this.checkSwitches()
    },

    eventMouseUp(event) {
        if (this.isTouch) return this.isTouch = false

        switch(event.button) {
            case 0:
                const indexFire = this.fire.findIndex(f => f === 'mouse')
                this.fire.splice(indexFire,1)
                break
            case 2:
                const indexHyperspace = this.hyperspace.findIndex(h => h === 'mouse')
                this.hyperspace.splice(indexHyperspace,1)
                break
        }
        
        if (!this.pause) this.checkSwitches()
    },

    eventTouchStart(event) {
        this.isTouch = true

        this.touchStart = []
        this.touchEnd = []

        for (let i = 0; i < event.targetTouches.length; i++) {
            this.touchStart.push({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY})
        }

        this.touchEnd = this.touchStart

        if (!this.fire.includes('touch')) this.fire.unshift('touch')

        this.rotation = []

        if (!this.pause) this.checkSwitches()
    },

    eventTouchMove(event) {
        this.touchEnd = []

        for (let i = 0; i < event.targetTouches.length; i++) {
            this.touchEnd.push({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY})
        }

        const moveSensitivity = 30
        const accelerationSensitivity = 50
        const hyperspaceSensitivity = 100
        let newRotation = ''
        let newAcclerate = false
        let newHyperspace = false

        for (let i = 0; i < event.targetTouches.length; i++) {
            if (this.touchEnd[i].x - this.touchStart[i].x < - moveSensitivity) newRotation = 'left'
            else if (this.touchEnd[i].x - this.touchStart[i].x > moveSensitivity) newRotation = 'right'

            if (this.touchEnd[i].y - this.touchStart[i].y < - accelerationSensitivity) newAcclerate = true

            if (this.touchEnd[i].y - this.touchStart[i].y > hyperspaceSensitivity) newHyperspace = true
        }

        if (newRotation === 'left' && !this.rotation.includes('left')) this.rotation.unshift('left')
        if (newRotation === 'right' && !this.rotation.includes('right')) this.rotation.unshift('right')

        this.accelerate = newAcclerate

        if (newHyperspace && !this.hyperspace.includes('touch')) {
            this.hyperspace.unshift('touch')
            this.rotation = []
        } 

        if (!this.pause) this.checkSwitches()
    },

    eventTouchEnd() {
        this.accelerate = false
        this.fire = []
        this.hyperspace = []

        if (!this.pause) this.checkSwitches()
    },

}